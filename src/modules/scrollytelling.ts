interface StepTelemetry {
  altitude: string;
  speed: string;
  powertrain: string;
  noise: string;
  aircraftTag: string;
  blipTranslateY: number;
  statusBadge: string;
}

const TELEMETRY_PHASES: StepTelemetry[] = [
  {
    altitude: '150 m',
    speed: '75 km/h',
    powertrain: 'ELECTRIC TORQUE LIFT',
    noise: '52 dBA (Siêu êm)',
    aircraftTag: 'HX-9 LIFT-OFF',
    blipTranslateY: 40,
    statusBadge: '● PHA 01 // CẤT CÁNH THẲNG ĐỨNG',
  },
  {
    altitude: '1,850 m',
    speed: '280 km/h',
    powertrain: 'VECTOR THRUST TRANSITION',
    noise: '58 dBA',
    aircraftTag: 'HX-9 ACCELERATION',
    blipTranslateY: 10,
    statusBadge: '● PHA 02 // CHUYỂN TIẾP VECTƠ',
  },
  {
    altitude: '6,200 m',
    speed: '340 km/h',
    powertrain: 'QUIETROTOR™ STEALTH CRUISE',
    noise: '64 dBA (Cách âm cabin)',
    aircraftTag: 'HX-9 HIGH-ALTITUDE',
    blipTranslateY: -35,
    statusBadge: '● PHA 03 // BAY HÀNH TRÌNH ĐỘ CAO CAO',
  },
  {
    altitude: '180 m',
    speed: '85 km/h',
    powertrain: 'SAFELAND™ LIDAR DESCENT',
    noise: '48 dBA (Tiếp đất)',
    aircraftTag: 'HX-9 FINAL APPROACH',
    blipTranslateY: 30,
    statusBadge: '● PHA 04 // HẠ CÁNH CHÍNH XÁC',
  },
];

export function initScrollytelling(): void {
  const steps = document.querySelectorAll<HTMLElement>('.scrolly-step-card');
  const altitudeEl = document.getElementById('hudAltitudeValue');
  const speedEl = document.getElementById('hudSpeedValue');
  const powertrainEl = document.getElementById('hudPowertrainStatus');
  const noiseEl = document.getElementById('hudNoiseValue');
  const aircraftTagEl = document.getElementById('hudAircraftTag');
  const blipEl = document.getElementById('radarAircraftBlip');
  const statusBadgeEl = document.getElementById('hudMissionStatusBadge');

  if (!steps.length) return;

  function updateHUD(phaseIndex: number): void {
    const data = TELEMETRY_PHASES[phaseIndex] || TELEMETRY_PHASES[0];

    if (altitudeEl) altitudeEl.textContent = data.altitude;
    if (speedEl) speedEl.textContent = data.speed;
    if (powertrainEl) powertrainEl.textContent = data.powertrain;
    if (noiseEl) noiseEl.textContent = data.noise;
    if (aircraftTagEl) aircraftTagEl.textContent = data.aircraftTag;
    if (statusBadgeEl) statusBadgeEl.textContent = data.statusBadge;

    if (blipEl) {
      blipEl.style.transform = `translateY(${data.blipTranslateY}px)`;
    }

    steps.forEach((step, idx) => {
      if (idx === phaseIndex) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0', 10);
          updateHUD(stepIndex);
        }
      });
    },
    {
      root: null,
      threshold: 0.5,
      rootMargin: '-10% 0px -10% 0px',
    }
  );

  steps.forEach((step) => observer.observe(step));
}
