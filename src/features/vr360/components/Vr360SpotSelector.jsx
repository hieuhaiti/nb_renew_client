import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

export default function Vr360SpotSelector({ spots = [], selectedSpotId, onSpotChange, loading }) {
  const { t } = useTranslation();
  const list = Array.isArray(spots) ? spots : [];
  const selectValue = selectedSpotId == null ? '' : String(selectedSpotId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="typo-section-title flex items-center gap-2">
          <MapPin className="text-primary h-4 w-4" />
          {t('vr360.pick_spot')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={selectValue} onValueChange={onSpotChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('vr360.pick_spot_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {list.map((spot) => (
                <SelectItem key={spot.id} value={String(spot.id)}>
                  {spot.name_vi || spot.name_en || spot.name || spot.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
}
