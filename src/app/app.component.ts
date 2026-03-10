import { Component } from '@angular/core';
import { BranchSearchComponent } from './features/branches/components/branch-search/branch-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BranchSearchComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
