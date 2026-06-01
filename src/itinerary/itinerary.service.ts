import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ==================== TYPES ====================

interface ItineraryParams {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  duration: number; // dalam jam
}

export interface ItineraryStop {
  order: number;
  restaurantId: string;
  restaurantName: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceFromPrev: number;      // km dari titik sebelumnya
  travelTimeMinutes: number;     // menit perjalanan dari titik sebelumnya
  diningTimeMinutes: number;     // waktu makan (tetap 60 menit)
  arrivalTimeMinutes: number;    // akumulasi menit sejak start
  arrivalTimeLabel: string;      // format "X jam Y menit dari start"
  isPromoActive: boolean;
  discountDisplay: string | null;
  recommendedMenus: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
}

// ==================== SERVICE ====================

@Injectable()
export class ItineraryService {
  constructor(private prisma: PrismaService) {}

  // ==================== HAVERSINE FORMULA ====================

  /**
   * Hitung jarak antara dua koordinat dalam kilometer menggunakan rumus Haversine.
   */
  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Radius bumi dalam km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Hitung estimasi waktu perjalanan dalam menit.
   * Asumsi kecepatan kota rata-rata: 30 km/jam.
   */
  private travelMinutes(distanceKm: number): number {
    const AVG_SPEED_KMH = 30;
    return (distanceKm / AVG_SPEED_KMH) * 60;
  }

  /**
   * Format akumulasi menit menjadi label yang mudah dibaca.
   * Contoh: 125 menit -> "2 jam 5 menit dari start"
   */
  private formatArrivalLabel(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);

    if (hours === 0) return `${mins} menit dari start`;
    if (mins === 0) return `${hours} jam dari start`;
    return `${hours} jam ${mins} menit dari start`;
  }

  // ==================== PROMO CHECK ====================

  /**
   * Periksa apakah jam saat ini (WIB/UTC+7) berada dalam rentang promo.
   */
  private getCurrentWIBTime(): string {
    const now = new Date();
    const wibOffset = 7 * 60;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const h = Math.floor(wibMinutes / 60);
    const m = wibMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // ==================== MAIN ALGORITHM ====================

  async buildItinerary(params: ItineraryParams): Promise<ItineraryStop[]> {
    const { startLat, startLng, duration } = params;
    const DINING_TIME_MINUTES = 60; // Asumsi tetap 1 jam per restoran
    const durationMinutes = duration * 60;

    // 1. Ambil semua restoran yang ownernya ACTIVE beserta menu dan promo
    const allRestaurants = await this.prisma.restaurant.findMany({
      where: {
        owner: { status: 'ACTIVE' },
      },
      include: {
        menus: {
          orderBy: { price: 'asc' },
          take: 5, // Ambil maks 5 menu rekomendasi (yang termurah)
        },
        promos: true,
      },
    });

    if (allRestaurants.length === 0) {
      return [];
    }

    const currentTime = this.getCurrentWIBTime();

    // 2. Set up state untuk algoritma nearest-neighbor
    let currentLat = startLat;
    let currentLng = startLng;
    const visited = new Set<string>();
    const itinerary: ItineraryStop[] = [];
    let accumulatedMinutes = 0; // Total waktu terpakai

    // 3. Loop greedy nearest-neighbor sampai waktu habis
    while (true) {
      // Kandidat adalah restoran yang belum dikunjungi
      const candidates = allRestaurants.filter((r) => !visited.has(r.id));
      if (candidates.length === 0) break;

      // Hitung jarak dari titik acuan saat ini ke semua kandidat
      const withDistance = candidates.map((r) => ({
        restaurant: r,
        distanceKm: this.haversineKm(currentLat, currentLng, r.latitude, r.longitude),
      }));

      // Urutkan dari yang terdekat
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

      const nearest = withDistance[0];
      const travelMins = this.travelMinutes(nearest.distanceKm);

      // Kalkulasi total waktu jika restoran ini dimasukkan
      const timeNeeded = travelMins + DINING_TIME_MINUTES;

      // Hentikan jika penambahan restoran berikutnya melebihi durasi
      if (accumulatedMinutes + timeNeeded > durationMinutes) {
        break;
      }

      // Tambahkan akumulasi waktu
      accumulatedMinutes += timeNeeded;

      // Cek status promo
      const r = nearest.restaurant;
      let isPromoActive = false;
      let discountDisplay: string | null = null;

      for (const promo of r.promos) {
        if (currentTime >= promo.startHour && currentTime <= promo.endHour) {
          isPromoActive = true;
          discountDisplay = `${promo.discount}%`;
          break;
        }
      }

      // Susun stop entry
      const arrivalMinutes = accumulatedMinutes - DINING_TIME_MINUTES; // Waktu tiba (sebelum makan)
      const stop: ItineraryStop = {
        order: itinerary.length + 1,
        restaurantId: r.id,
        restaurantName: r.name,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        distanceFromPrev: parseFloat(nearest.distanceKm.toFixed(2)),
        travelTimeMinutes: parseFloat(travelMins.toFixed(1)),
        diningTimeMinutes: DINING_TIME_MINUTES,
        arrivalTimeMinutes: parseFloat(arrivalMinutes.toFixed(1)),
        arrivalTimeLabel: this.formatArrivalLabel(arrivalMinutes),
        isPromoActive,
        discountDisplay,
        recommendedMenus: r.menus.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          price: m.price,
          image: m.image,
        })),
      };

      itinerary.push(stop);
      visited.add(r.id);

      // Geser titik acuan ke restoran yang baru dipilih
      currentLat = r.latitude;
      currentLng = r.longitude;
    }

    return itinerary;
  }
}
