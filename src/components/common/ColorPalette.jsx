import { useTheme, THEME_COLORS } from '@/contexts/ThemeContext';

export function ColorPalette() {
  const { theme, isDark } = useTheme();
  const colors = THEME_COLORS[theme]?.[isDark ? 'dark' : 'light'] || {};

  const colorGroups = {
    Background: ['background', 'foreground'],
    Card: ['card', 'card-foreground'],
    Semantic: ['primary', 'secondary', 'accent', 'destructive'],
    States: ['muted', 'border', 'input', 'ring'],
    Charts: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {theme} - {isDark ? 'Dark' : 'Light'} Mode
      </h2>

      {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
        <div key={groupName} className="space-y-3">
          <h3 className="text-muted-foreground text-lg font-semibold">{groupName}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {colorKeys.map((colorKey) => (
              <ColorItem key={colorKey} name={colorKey} hex={colors[colorKey]} isDark={isDark} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorItem({ name, hex, isDark }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className="space-y-2">
      <div
        className="border-border hover:ring-ring h-20 cursor-pointer rounded-lg border transition-all hover:ring-2"
        style={{ backgroundColor: hex }}
        onClick={handleCopy}
        title="Click to copy hex"
      />
      <div className="truncate text-xs font-medium capitalize" title={name}>
        {name}
      </div>
      <div className="text-muted-foreground truncate font-mono text-xs" title={hex}>
        {hex}
      </div>
    </div>
  );
}
