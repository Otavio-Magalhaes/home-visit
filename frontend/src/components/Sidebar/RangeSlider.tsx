import { Slider } from "../ui/slider.js";

export function RangeSlider({ min, max, step, value, onChange, collapsed }: any) {
  return (
    <div className={`${collapsed ? "w-12" : "w-full"}`}>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(arr: any) => onChange(arr[0] ?? min)}
        className="w-full"
      >
      </Slider>
    </div>
  );
}
