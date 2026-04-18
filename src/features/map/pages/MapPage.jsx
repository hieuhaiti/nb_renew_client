import MapBaseArea from '@/features/map/components/MapBase';
import MapFloatingLegend from '@/features/map/components/MapFloatingLegend';
import MapFloatingWeatherCard from '@/features/map/components/MapFloatingWeatherCard';
import MapLeftSidebar from '@/features/map/components/MapLeftSidebar';
import MapSubSidebar from '@/features/map/components/MapSubSidebar';
import MapLayout from '@/features/map/layout/MapLayout';
import { useSidebarStore } from '@/features/map/store/useSidebarStore';

export default function MapPage() {
  const isSubSidebarOpen = useSidebarStore((state) => state.isSubSidebarOpen);

  // Change to 'right' if you want to keep legend pinned to the right side.
  const legendAnchor = 'left';

  const leftLegendClassName = isSubSidebarOpen
    ? 'absolute bottom-4 z-50 hidden transition-[left] duration-300 ease-in-out lg:block lg:left-[calc(59%+1rem)] lg:w-[18%] xl:left-[calc(50%+1rem)] xl:w-[15%] 2xl:left-[calc(46%+1rem)] 2xl:w-[13%]'
    : 'absolute bottom-4 z-50 hidden transition-[left] duration-300 ease-in-out lg:block lg:left-[calc(31%+1rem)] lg:w-[18%] xl:left-[calc(26%+1rem)] xl:w-[15%] 2xl:left-[calc(24%+1rem)] 2xl:w-[13%]';

  const rightLegendClassName =
    'absolute right-4 bottom-4 z-50 hidden lg:block lg:w-[18%] xl:w-[15%] 2xl:w-[13%]';

  return (
    <MapLayout>
      <section className="bg-background relative h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        <MapLeftSidebar />

        <MapSubSidebar />

        <MapFloatingWeatherCard className="absolute top-4 right-4 z-60 w-[min(18rem,calc(100%-1rem))] md:w-[42%] lg:w-[18%] xl:w-[15%] 2xl:w-[13%]" />

        <MapFloatingLegend
          className={legendAnchor === 'left' ? leftLegendClassName : rightLegendClassName}
        />

        <MapBaseArea />
      </section>
    </MapLayout>
  );
}
