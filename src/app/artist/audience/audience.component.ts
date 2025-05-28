import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { PlayCountData } from '../../models/artist.interface';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-artist-audience',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  growthPercentage = 31;
  topSong = 'CANCION 1';
  topCountry = 'PERU';

  playCountData: PlayCountData[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  chart: Chart | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPlayCountData();
  }

  ngAfterViewInit(): void {
    // El gráfico se creará después de cargar los datos
  }

  loadPlayCountData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Obtener el ID del artista desde localStorage
    try {
      const artistData = localStorage.getItem('LOGIN_ARTISTA');
      if (artistData) {
        const artist = JSON.parse(artistData);

        // Obtener datos de reproducciones por ID de artista
        this.apiService.getArtistPlayCountByDay(artist.id).subscribe({
          next: (data) => {
            this.playCountData = data;
            this.isLoading = false;

            // Calcular el porcentaje de crecimiento si tenemos suficientes datos
            if (data.length >= 2) {
              const lastDay = data[0].conteo;
              const secondLastDay = data[1].conteo;
              if (secondLastDay > 0) {
                const growth = ((lastDay - secondLastDay) / secondLastDay) * 100;
                this.growthPercentage = Math.round(growth);
              }
            }

            // Crear el gráfico una vez que tenemos los datos
            setTimeout(() => {
              this.createChart();
            }, 100);
          },
          error: (error) => {
            console.error('Error al cargar los datos de reproducciones:', error);
            this.errorMessage = 'No se pudieron cargar los datos de reproducciones';
            this.isLoading = false;
          },
        });
      } else {
        this.errorMessage = 'No se encontró información del artista';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Error al procesar la información del artista:', error);
      this.errorMessage = 'Error al procesar la información del artista';
      this.isLoading = false;
    }
  }

  createChart(): void {
    if (!this.chartCanvas) {
      console.error('Canvas del gráfico no encontrado');
      return;
    }

    // Preparar datos para el gráfico
    const labels = this.playCountData
      .map((item) => {
        // Formatear fecha como 'MM/DD'
        const [year, month, day] = item.fecha;
        return `${month}/${day}`;
      })
      .reverse(); // Invertir para mostrar primero los más antiguos

    const counts = this.playCountData.map((item) => item.conteo).reverse();

    // Crear el gráfico
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto del gráfico');
      return;
    }

    // Destruir el gráfico existente si hay alguno
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Reproducciones',
            data: counts,
            borderColor: '#a168b3',
            backgroundColor: 'rgba(161, 104, 179, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#a168b3',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#999',
              font: {
                size: 12,
              },
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#999',
              font: {
                size: 12,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 12,
            },
            displayColors: false,
          },
        },
      },
    });
  }
}
