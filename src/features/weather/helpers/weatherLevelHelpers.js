import {
  Cloud,
  CloudMoon,
  AlertTriangle,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Snowflake,
  Sun,
  Wind,
} from 'lucide-react';
import icFaceGreen from '@/assets/icons/aqi-icon/ic-face-green.svg';
import icFaceOrange from '@/assets/icons/aqi-icon/ic-face-orange.svg';
import icFacePurple from '@/assets/icons/aqi-icon/ic-face-purple.svg';
import icFaceRed from '@/assets/icons/aqi-icon/ic-face-red.svg';
import icFaceYellow from '@/assets/icons/aqi-icon/ic-face-yellow.svg';

const WEATHER_ICON_MAP = {
  1000: { day: Sun, night: Moon, color: 'text-yellow-400', nightColor: 'text-blue-300' },
  1003: {
    day: CloudSun,
    night: CloudMoon,
    color: 'text-yellow-400',
    nightColor: 'text-blue-300',
  },
  1006: { day: Cloud, night: Cloud, color: 'text-slate-400' },
  1009: { day: Cloud, night: Cloud, color: 'text-slate-500' },
  1030: { day: CloudFog, night: CloudFog, color: 'text-gray-400' },
  1063: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-400' },
  1066: { day: CloudSnow, night: CloudSnow, color: 'text-sky-300' },
  1069: { day: CloudSnow, night: CloudSnow, color: 'text-slate-400' },
  1072: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-300' },
  1087: { day: CloudLightning, night: CloudLightning, color: 'text-yellow-500' },
  1114: { day: Wind, night: Wind, color: 'text-sky-400' },
  1117: { day: Snowflake, night: Snowflake, color: 'text-sky-200' },
  1135: { day: CloudFog, night: CloudFog, color: 'text-gray-400' },
  1147: { day: CloudFog, night: CloudFog, color: 'text-gray-500' },
  1150: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-400' },
  1153: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-400' },
  1168: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-300' },
  1171: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-500' },
  1180: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-500' },
  1183: { day: CloudDrizzle, night: CloudDrizzle, color: 'text-blue-500' },
  1186: { day: CloudRain, night: CloudRain, color: 'text-blue-500' },
  1189: { day: CloudRain, night: CloudRain, color: 'text-blue-600' },
  1192: { day: CloudRain, night: CloudRain, color: 'text-blue-600' },
  1195: { day: CloudRain, night: CloudRain, color: 'text-blue-700' },
  1198: { day: CloudRain, night: CloudRain, color: 'text-blue-400' },
  1201: { day: CloudRain, night: CloudRain, color: 'text-blue-600' },
  1204: { day: CloudSnow, night: CloudSnow, color: 'text-slate-400' },
  1207: { day: CloudSnow, night: CloudSnow, color: 'text-slate-500' },
  1210: { day: CloudSnow, night: CloudSnow, color: 'text-sky-300' },
  1213: { day: CloudSnow, night: CloudSnow, color: 'text-sky-300' },
  1216: { day: CloudSnow, night: CloudSnow, color: 'text-sky-400' },
  1219: { day: CloudSnow, night: CloudSnow, color: 'text-sky-400' },
  1222: { day: CloudSnow, night: CloudSnow, color: 'text-sky-500' },
  1225: { day: CloudSnow, night: CloudSnow, color: 'text-sky-500' },
  1237: { day: Snowflake, night: Snowflake, color: 'text-slate-400' },
  1240: { day: CloudRain, night: CloudRain, color: 'text-blue-500' },
  1243: { day: CloudRain, night: CloudRain, color: 'text-blue-600' },
  1246: { day: CloudRain, night: CloudRain, color: 'text-blue-700' },
  1249: { day: CloudSnow, night: CloudSnow, color: 'text-slate-400' },
  1252: { day: CloudSnow, night: CloudSnow, color: 'text-slate-500' },
  1255: { day: CloudSnow, night: CloudSnow, color: 'text-sky-400' },
  1258: { day: CloudSnow, night: CloudSnow, color: 'text-sky-500' },
  1261: { day: Snowflake, night: Snowflake, color: 'text-slate-400' },
  1264: { day: Snowflake, night: Snowflake, color: 'text-slate-500' },
  1273: { day: CloudLightning, night: CloudLightning, color: 'text-yellow-500' },
  1276: { day: CloudLightning, night: CloudLightning, color: 'text-yellow-600' },
  1279: { day: CloudLightning, night: CloudLightning, color: 'text-yellow-500' },
  1282: { day: CloudLightning, night: CloudLightning, color: 'text-yellow-600' },
};

function mapOpenWeatherIdToWeatherApiCode(conditionId) {
  if (conditionId >= 200 && conditionId < 300) return 1276;
  if (conditionId >= 300 && conditionId < 400) return 1153;
  if (conditionId >= 500 && conditionId < 600) return 1189;
  if (conditionId >= 600 && conditionId < 700) return 1216;
  if (conditionId >= 700 && conditionId < 800) return 1135;
  if (conditionId === 800) return 1000;
  if (conditionId === 801) return 1003;
  if (conditionId >= 802 && conditionId <= 804) return 1009;
  return 1000;
}

export function getWeatherIconMeta({ conditionId, iconCode, weatherApiCode, isDay: isDayInput }) {
  const mappedCode = weatherApiCode || mapOpenWeatherIdToWeatherApiCode(conditionId);
  const iconData = WEATHER_ICON_MAP[mappedCode] || WEATHER_ICON_MAP[1000];
  const isDay = typeof isDayInput === 'boolean' ? isDayInput : String(iconCode || '').endsWith('d');
  const icon = isDay ? iconData.day : iconData.night;
  const toneClass = isDay
    ? iconData.color || 'text-yellow-400'
    : iconData.nightColor || iconData.color || 'text-blue-300';

  return {
    icon,
    toneClass,
    mappedCode,
    isDay,
  };
}

const AQI_LEVEL_META = {
  1: {
    labelKey: 'mapPage.layout.aqiGood',
    toneClass: 'text-green-600',
    bgClass: 'bg-green-100',
    iconSrc: icFaceGreen,
  },
  2: {
    labelKey: 'mapPage.layout.aqiFair',
    toneClass: 'text-yellow-600',
    bgClass: 'bg-yellow-100',
    iconSrc: icFaceYellow,
  },
  3: {
    labelKey: 'mapPage.layout.aqiModerate',
    toneClass: 'text-orange-600',
    bgClass: 'bg-orange-100',
    iconSrc: icFaceOrange,
  },
  4: {
    labelKey: 'mapPage.layout.aqiPoor',
    toneClass: 'text-red-600',
    bgClass: 'bg-red-100',
    iconSrc: icFaceRed,
  },
  5: {
    labelKey: 'mapPage.layout.aqiVeryPoor',
    toneClass: 'text-purple-600',
    bgClass: 'bg-purple-100',
    iconSrc: icFacePurple,
  },
  6: {
    labelKey: 'mapPage.layout.aqiVeryPoor',
    toneClass: 'text-purple-800',
    bgClass: 'bg-purple-200',
    iconSrc: icFacePurple,
  },
};

export function getAqiLevelMeta(aqiValue) {
  return (
    AQI_LEVEL_META[aqiValue] || {
      labelKey: 'mapPage.layout.aqiUnknown',
      toneClass: 'text-muted-foreground',
      bgClass: 'bg-muted/40',
      iconSrc: icFaceYellow,
    }
  );
}

export const ALERT_SEVERITY = {
  high: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    icon: AlertTriangle,
  },
  medium: {
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    icon: AlertTriangle,
  },
  low: {
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: AlertTriangle,
  },
};

export function getAlertSeverityMeta(severity) {
  return ALERT_SEVERITY[severity] || ALERT_SEVERITY.low;
}

export function getAlertToneClass(severity) {
  return getAlertSeverityMeta(severity).color;
}

export function getWeatherAlertFromMetrics({ aqiValue, tempC, windMps, weatherMain }) {
  if (aqiValue >= 4) {
    return {
      severity: 'high',
      labelKey: 'mapPage.layout.weatherAlertAirPollutionHigh',
    };
  }

  if (tempC >= 35) {
    return {
      severity: 'medium',
      labelKey: 'mapPage.layout.weatherAlertHeat',
    };
  }

  if (windMps >= 12) {
    return {
      severity: 'medium',
      labelKey: 'mapPage.layout.weatherAlertWind',
    };
  }

  if (weatherMain === 'Thunderstorm') {
    return {
      severity: 'high',
      labelKey: 'mapPage.layout.weatherAlertThunderstorm',
    };
  }

  return null;
}

export function formatTemperature(temp, unit = '°C') {
  return `${Math.round(Number(temp) || 0)}${unit}`;
}

export function formatWindSpeedKph(speed) {
  return `${Math.round((Number(speed) || 0) * 3.6)} km/h`;
}

export function formatHumidity(humidity) {
  return `${Math.round(Number(humidity) || 0)}%`;
}
