import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'svg[appDealCardsSvg]',
  template: `
    <!-- trebol card -->    <svg:polygon stroke="black" stroke-width="20" fill="#f1f1f1" points="10,240 300,910 720,730 400,60" />    <svg:text x="130" y="380" font-size="180px" rotate="-25">♣️</svg:text>        <!-- diamond card -->    <svg:polygon stroke="black" stroke-width="20" fill="#f4f4f4" points="315,10 815,10 810,760 315,760" />    <svg:text x="350" y="500" font-size="320px">🔶</svg:text>    <svg:text x="350" y="130" font-size="80px">🔶</svg:text>        <!-- hand -->    <svg:rect fill="#d17515" x="600" y="890" width="380" height="90" />    <svg:path fill="lightpink" d="M650,890 565,770 730,770C640,680 650,580 720,555L820,670 820,365 C950,400 990,520 960,650L950,890" />    
  `,
})
export class DealCardsSvgComponent {}
