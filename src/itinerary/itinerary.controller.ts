import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/itinerary')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  /**
   * GET /api/itinerary
   * Query Params:
   *   - startLat  (number) : Latitude titik keberangkatan
   *   - startLng  (number) : Longitude titik keberangkatan
   *   - endLat    (number) : Latitude titik tujuan akhir (referensi)
   *   - endLng    (number) : Longitude titik tujuan akhir (referensi)
   *   - duration  (number) : Total durasi perjalanan dalam JAM
   *
   * Guard: USER
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getItinerary(
    @Query('startLat') startLat: string,
    @Query('startLng') startLng: string,
    @Query('endLat') endLat: string,
    @Query('endLng') endLng: string,
    @Query('duration') duration: string,
  ) {
    // Konversi query params string -> number secara aman
    const params = {
      startLat: parseFloat(startLat) || 0,
      startLng: parseFloat(startLng) || 0,
      endLat: parseFloat(endLat) || 0,
      endLng: parseFloat(endLng) || 0,
      duration: Number(duration) || 0,
    };

    const itinerary = await this.itineraryService.buildItinerary(params);

    return {
      success: true,
      message:
        itinerary.length > 0
          ? `Rute wisata kuliner dengan ${itinerary.length} destinasi berhasil disusun`
          : 'Durasi terlalu singkat untuk menyusun rute. Coba tambah durasi perjalanan.',
      meta: {
        totalStops: itinerary.length,
        durationHours: params.duration,
        startCoordinate: { lat: params.startLat, lng: params.startLng },
        endCoordinate: { lat: params.endLat, lng: params.endLng },
      },
      data: itinerary,
    };
  }
}
