import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ergovision-logo',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 186 206"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [class]="class()">
      <mask id="mask0_53_763" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="10" width="168" height="168">
        <path d="M177.5 10H10V177.5H177.5V10Z" fill="white"/>
      </mask>
      <g >
        <path d="M33.2409 33.2409C21.4216 45.0601 13.3726 60.1187 10.1117 76.5127C6.85079 92.9063 8.5244 109.899 14.9209 125.342C21.3175 140.784 32.1496 153.983 46.0474 163.269C59.9455 172.556 76.2852 177.512 93 177.512C109.715 177.512 126.055 172.556 139.953 163.269C153.85 153.983 164.682 140.784 171.079 125.342C177.476 109.899 179.149 92.9063 175.888 76.5127C172.627 60.1187 164.578 45.0601 152.759 33.2409L93 93L33.2409 33.2409Z" fill="#2B7FFF"/>
      </g>
    </svg>
  `,
  styles: ``
})
export class ErgovisionLogoComponent {
  size = input<number>(32);
  class = input<string>('');
}
