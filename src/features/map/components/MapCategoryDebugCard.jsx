import { MAP_PAGE_DEBUG_TEXT } from '@/features/map/constant';

export default function MapCategoryDebugCard({
  pathname,
  categorySlug,
  resolvedSlug,
  isFetched,
  defaultCategorySlug,
  matchedCategory,
}) {
  return (
    <div className="bg-card border-border w-full max-w-xl rounded-xl border p-5 shadow-sm">
      <div className="text-lg font-semibold">{MAP_PAGE_DEBUG_TEXT.title}</div>
      <div className="text-muted-foreground mt-3 space-y-2 text-sm">
        <div>pathname: {pathname}</div>
        <div>param categorySlug: {categorySlug || MAP_PAGE_DEBUG_TEXT.empty}</div>
        <div>resolved slug: {resolvedSlug || MAP_PAGE_DEBUG_TEXT.empty}</div>
        <div>isFetched: {String(isFetched)}</div>
        <div>default category slug: {defaultCategorySlug || MAP_PAGE_DEBUG_TEXT.none}</div>
        <div>matched category id: {matchedCategory?.id ?? MAP_PAGE_DEBUG_TEXT.none}</div>
        <div>matched category name: {matchedCategory?.name || MAP_PAGE_DEBUG_TEXT.none}</div>
      </div>
    </div>
  );
}
