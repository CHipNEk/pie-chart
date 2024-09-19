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
  colors: string[] = ['#996aeb', '#dece97', '#e38ab1'];
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
    const startAngle = index * (360 / this.slices); // Góc cắt ban đầu theo index.Chia vòng tròn thành các phần đều nhau
    const endAngle = (index + 1) * (360 / this.slices); // Góc cắt kết thúc
    const start = this.polarToCartesian(startAngle); // Nhận vào góc bắt đầu trả về tọa độ x,y
    const end = this.polarToCartesian(endAngle); // Nhận vào góc kết thúc trả về tọa độ x,y
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"; // Xác định cung nhỏ (0) hoặc cung lớn (1)
    const path = `
                  M ${start.x} ${start.y} 
                  A 100 100 0 ${largeArcFlag} 1 ${end.x} ${end.y} 
                  L 0 0
                `;
                // M: move to, di chuyển điểm bắt đầu từ tọa độ {start.x} {start.y} 
                /* A: vẽ cung tròn 
                      100 100 là bán kính x,y của elip
                      0 là góc xoay của elip
                      1 là sweep flag: hướng vẽ cung(1 cho cùng chiều kim đồng hồ) 
                      ${end.x} ${end.y} điểm kết thúc
                */
                // L: line to, vẽ đường thẳng về 0 0(gốc tọa độ)

    const midAngle = (startAngle + endAngle) / 2; // Góc giữa lát cắt
    const labelRadius = 75; // Bán kính từ tâm đến chỗ đặt text (3/4R)
    const labelPosition = this.polarToCartesian(midAngle, labelRadius); // Nhận vào góc giữa và bán kính trả về tọa độ x,y
  
    return { path, labelPosition };
  }
  
  polarToCartesian(angle: number, radius: number = 100): { x: number, y: number } { // Nhận vào góc và bán kính trả về tọa độ x,y
    const radians = (angle - 90) * Math.PI / 180; // Công thức chuyển đổi từ độ sang radian (radians = degrees * π/180) -90 độ để góc cắt bắt đầu từ đỉnh
      return { // Trả về tọa độ x,y
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
