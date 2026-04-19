import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import MapLayout from '@/features/map/layout/MapLayout';
import MapBaseArea from '@/features/map/components/MapBase';
import { currentHeaderSidebar, headerSidebar } from '@/features/map/constant/sidebarConstant';
import { useCategoriesStore } from '@/features/categories/store/useCategoriesStore';

export default function MapPage() {
  const { t } = useTranslation();
  const [activeSidebar, setActiveSidebar] = useState(currentHeaderSidebar);
  const categoriesStoreID = useCategoriesStore((state) => state.categoriesStoreID);

  const renderDirectionPlaceholder = () => (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="space-y-2">
        <p className="truncate text-sm font-bold">
          {t('mapPage.layout.directionInputTitle', {
            defaultValue: 'Nhap diem bat dau va diem den',
          })}
        </p>
        <Input
          placeholder={t('mapPage.layout.directionStartPlaceholder', {
            defaultValue: 'Diem bat dau',
          })}
        />
        <Input
          placeholder={t('mapPage.layout.directionEndPlaceholder', {
            defaultValue: 'Diem den',
          })}
        />
        <Button className="w-full" size="sm">
          {t('mapPage.layout.directionSearchRoute', { defaultValue: 'Tim duong di' })}
        </Button>
      </div>

      <Separator />

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <p className="truncate text-sm font-bold">
          {t('mapPage.layout.directionDetailTitle', { defaultValue: 'DirectionMap' })}
        </p>
        <div className="bg-muted/40 space-y-2 rounded-lg p-3 text-xs">
          <p className="line-clamp-3 font-normal">
            {t('mapPage.layout.directionSampleLine1', {
              defaultValue: '1. Di theo duong Tran Hung Dao (2.1 km, 6 phut).',
            })}
          </p>
          <p className="line-clamp-3 font-normal">
            {t('mapPage.layout.directionSampleLine2', {
              defaultValue: '2. Re phai vao QL1A huong trung tam thanh pho.',
            })}
          </p>
          <p className="line-clamp-3 font-normal">
            {t('mapPage.layout.directionSampleLine3', {
              defaultValue: '3. Den diem du lich da chon.',
            })}
          </p>
        </div>
      </div>
    </div>
  );

  const activeHeader =
    headerSidebar.find((item) => item.value === activeSidebar) ??
    headerSidebar.find((item) => item.value === currentHeaderSidebar);

  const monitoringItems = [
    {
      name: t('mapPage.layout.monitoringAreaTrangAn', { defaultValue: 'Tràng An' }),
      load: 92,
      tone: 'critical',
    },
    {
      name: t('mapPage.layout.monitoringAreaHangMua', { defaultValue: 'Hang Múa' }),
      load: 68,
      tone: 'warning',
    },
    {
      name: t('mapPage.layout.monitoringAreaTamCoc', { defaultValue: 'Tam Cốc' }),
      load: 44,
      tone: 'safe',
    },
  ];

  const rightPanelContent = (() => {
    const current = activeHeader?.component;

    if (activeSidebar === 'direction') {
      return renderDirectionPlaceholder();
    }

    if (typeof current === 'function') {
      const ActiveSidebarComponent = current;
      return <ActiveSidebarComponent categoryId={categoriesStoreID} />;
    }

    if (typeof current === 'string') {
      return (
        <div className="bg-muted/30 flex h-full min-h-0 items-center justify-center rounded-lg border border-dashed px-3 text-center">
          <p className="line-clamp-3 text-sm font-normal">{current}</p>
        </div>
      );
    }

    return (
      <div className="bg-muted/30 flex h-full min-h-0 items-center justify-center rounded-lg border border-dashed px-3 text-center">
        <p className="line-clamp-3 text-sm font-normal">
          {t('mapPage.layout.componentPlaceholder', {
            defaultValue: 'LayerData Component Placeholder',
          })}
        </p>
      </div>
    );
  })();

  return (
    <MapLayout>
      <section className="bg-background flex h-full w-full overflow-x-hidden overflow-y-auto p-3">
        <div className="flex min-h-full w-full gap-3">
          <div className="flex min-h-0 flex-7 flex-col gap-3">
            <Card className="bg-card/95 border-border shrink-0">
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {headerSidebar.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSidebar === item.value;

                    return (
                      <Button
                        key={item.value}
                        size="sm"
                        variant={isActive ? 'default' : 'secondary'}
                        onClick={() => setActiveSidebar(item.value)}
                        className="max-w-full gap-1.5"
                      >
                        <Icon size={14} />
                        <span className="truncate text-xs font-bold">
                          {t(item.label, { defaultValue: item.value })}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/95 border-border min-h-0 flex-1 overflow-hidden">
              <CardContent className="h-full p-0">
                <MapBaseArea />
              </CardContent>
            </Card>

            <div className="flex shrink-0 gap-3">
              <Card className="bg-card/95 border-border h-full min-w-0 flex-1">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="truncate text-sm font-bold">
                    {t('mapPage.layout.smartMonitoringTitle', {
                      defaultValue: 'Giám sát tải & điều hướng thông minh',
                    })}
                  </CardTitle>
                  <span className="bg-warning-soft text-warning rounded-full px-2 py-1 text-[10px] font-extrabold">
                    {t('mapPage.layout.monitoringAlertTag', { defaultValue: 'Cảnh báo' })}
                  </span>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  {monitoringItems.map((item) => {
                    const badgeClass =
                      item.tone === 'critical'
                        ? 'bg-destructive/15 text-destructive'
                        : item.tone === 'warning'
                          ? 'bg-warning-soft text-warning'
                          : 'bg-secondary/15 text-secondary';

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span>{item.name}</span>
                          <span
                            className={
                              badgeClass + ' rounded-full px-2 py-1 text-[10px] font-extrabold'
                            }
                          >
                            {t('mapPage.layout.monitoringCapacity', {
                              defaultValue: '{{value}}% công suất',
                              value: item.load,
                            })}
                          </span>
                        </div>
                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                          <div
                            className="bg-secondary h-full rounded-full"
                            style={{ width: `${item.load}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-card/95 border-border h-full min-w-0 flex-1">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="truncate text-sm font-bold">
                    {t('mapPage.layout.aiChatbotTitle', {
                      defaultValue: 'Chatbot AI tương tác bản đồ',
                    })}
                  </CardTitle>
                  <span className="text-muted-foreground text-[11px] font-semibold">
                    {t('mapPage.layout.aiAssistantLabel', { defaultValue: 'Map-aware assistant' })}
                  </span>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="bg-muted/40 space-y-2 rounded-lg border p-2.5">
                    <div className="bg-card text-muted-foreground rounded-md border p-2 text-[11px] leading-relaxed font-normal">
                      {t('mapPage.layout.aiPromptSample', {
                        defaultValue:
                          'Gợi ý giúp tôi tour nhẹ trong ngày, tránh điểm quá tải và ưu tiên nơi có ảnh 360.',
                      })}
                    </div>
                    <div className="bg-card text-muted-foreground rounded-md border p-2 text-[11px] leading-relaxed font-normal">
                      {t('mapPage.layout.aiReplySample', {
                        defaultValue:
                          'Đã tìm thấy 3 phương án. Tràng An đang đông, đề xuất chuyển trước sang Hang Múa và quay lại Tràng An sau 15:30.',
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('mapPage.layout.aiInputPlaceholder', {
                        defaultValue:
                          'Hỏi về điểm du lịch, thời tiết, chỉ đường, tải điểm đến, ảnh vệ tinh...',
                      })}
                    />
                    <Button size="sm">{t('mapPage.layout.aiSend', { defaultValue: 'Gửi' })}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="min-h-0 flex-3">
            <Card className="bg-card/95 border-border flex h-full min-h-0 flex-col">
              <CardHeader>
                <CardTitle className="truncate text-sm font-bold">
                  {t(activeHeader?.label || 'headerAside.layerData', {
                    defaultValue: activeHeader?.value || currentHeaderSidebar,
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
                {rightPanelContent}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </MapLayout>
  );
}
