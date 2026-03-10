import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  Observable,
  Subject,
  merge,
  of,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  startWith,
} from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { BranchService } from '../../services/branch.service';
import {
  BranchSearchVM,
  INITIAL_BRANCH_VM,
} from '../../models/branch.model';

@Component({
  selector: 'app-branch-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-search.component.html',
  styleUrl: './branch-search.component.scss',
})
export class BranchSearchComponent implements OnInit {
  private readonly branchService = inject(BranchService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly manualSearch$ = new Subject<string>();

  readonly searchTerm$ = merge(
    this.searchControl.valueChanges,
    this.manualSearch$
  ).pipe(
    startWith(''),
    debounceTime(0),
    map((term) => term.trim()),
    distinctUntilChanged(),
    filter((term) => term.length >= 2 || term.length === 0)
  );

  readonly vm$: Observable<BranchSearchVM> = this.searchTerm$.pipe(
    mergeMap((term) =>
      this.branchService.searchBranches(term).pipe(
        map((results) => ({
          results,
          isLoading: false,
          error: null,
          term,
        })),
        startWith({
          results: [],
          isLoading: true,
          error: null,
          term,
        }),
        catchError((err) =>
          of({
            results: [],
            isLoading: false,
            error: err?.message ?? 'Errore sconosciuto',
            term,
          })
        )
      )
    )
  );

  readonly vm = toSignal(this.vm$, { initialValue: INITIAL_BRANCH_VM });

  ngOnInit(): void {
    this.vm$.subscribe((vm) =>
      console.log('[analytics] vm changed:', vm.term)
    );
  }
}
