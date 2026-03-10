import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Branch, MOCK_BRANCHES } from '../models/branch.model';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly http = inject(HttpClient);

  searchBranches(term: string): Observable<Branch[]> {
    const latency = term.length <= 3 ? 400 : 100;

    const filtered = term
      ? MOCK_BRANCHES.filter(
          (b) =>
            b.name.toLowerCase().includes(term.toLowerCase()) ||
            b.city.toLowerCase().includes(term.toLowerCase()) ||
            b.address.toLowerCase().includes(term.toLowerCase())
        )
      : MOCK_BRANCHES;

    return of(filtered).pipe(delay(latency));
  }
}
