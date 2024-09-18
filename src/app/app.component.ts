import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class LuckyWheelComponent {
  slices: number = 1;
  tempSlices: number = 1;
  chartData: any[] = [];
  colors: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffa726', '#ff7043'];
  chartForm: FormGroup; 

  constructor(private fb: FormBuilder) {
    this.chartForm = this.fb.group({
      slice: this.fb.array([])
    });
  }

  get sliceArray(): FormArray {
    return this.chartForm.get('slice') as FormArray;
  }

  ngOnInit() {
    this.updateSliceInputs(); 
    this.updateChartData();
  }

  updateTempSlices(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tempSlices = Math.min(Math.max(parseInt(value, 10), 1), 12);
  }

  applyChanges() {
    this.slices = this.tempSlices;
    this.updateSliceInputs();
    this.updateChartData();
  }

  updateChartData() {
    const sliceContents = this.chartForm.get('slice').value; 
    this.chartData = Array(this.slices).fill(1).map((value, index) => ({
      name: `Slice ${index + 1}`,
      value: value,
      color: this.colors[index % this.colors.length],
      content: sliceContents[index] || '', 
      isImage: false
    }));
  }

  createSlicePath(index: number): { path: string, labelPosition: { x: number, y: number } } {
    const startAngle = index * (360 / this.slices);
    const endAngle = (index + 1) * (360 / this.slices);
    const start = this.polarToCartesian(startAngle);
    const end = this.polarToCartesian(endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const path = `M ${start.x} ${start.y} A 100 100 0 ${largeArcFlag} 1 ${end.x} ${end.y} L 0 0`;
  
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = 75; 
    const labelPosition = this.polarToCartesian(midAngle, labelRadius);
  
    return { path, labelPosition };
  }
  
  polarToCartesian(angle: number, radius: number = 100): { x: number, y: number } {
    const radians = (angle - 90) * Math.PI / 180; 
    return {
      x: radius * Math.cos(radians),
      y: radius * Math.sin(radians)
    };
  }

  updateSliceInputs() {
    const control = <FormArray>this.chartForm.get('slice');
    control.clear(); 
    for (let i = 0; i < this.slices; i++) {
      control.push(this.fb.control('')); 
    }
  }

  onSliceContentChange(index: number, event: any) {
    const content = event.target.value;
    this.updateSliceContent(index, content, false);
    this.updateChartData();
  }

  updateSliceContent(index: number, content: string, isImage: boolean) {
    if (index >= 0 && index < this.chartData.length) {
      this.chartData[index].content = content;
      this.chartData[index].isImage = isImage;
    }
  }

}
