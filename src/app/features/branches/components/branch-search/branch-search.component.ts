import { Component, inject, OnInit, OnDestroy, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { Observable, Subject, merge, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
} from "rxjs/operators";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { BranchService } from "../../services/branch.service";
import { BranchSearchVM, INITIAL_BRANCH_VM } from "../../models/branch.model";

@Component({
  selector: "app-branch-search",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./branch-search.component.html",
  styleUrl: "./branch-search.component.scss",
})
export class BranchSearchComponent implements OnInit{
  
  private readonly branchService = inject(BranchService);

  private readonly destroy = inject(DestroyRef) //inject() usa il dependency injection container del componente

  readonly searchControl = new FormControl("", { nonNullable: true });
  readonly manualSearch$ = new Subject<string>();

  readonly searchTerm$ = merge(
    this.searchControl.valueChanges,
    this.manualSearch$,
  ).pipe(
    startWith(""), //all'inizio deve essere una stringa vuota 
   // debounceTime(1000), NON DEVE STARE QUI 
    map((term) => term.trim()),//toglie gli spazi iniziali di quello che digita l'utente
    distinctUntilChanged(),//emette il valore solo se è diverso dal precente
    filter((term) => term.length >= 2 || term.length === 0), //emette il valore solo se è maggiore di 2
  );

  readonly vm$: Observable<BranchSearchVM> = this.searchTerm$.pipe(
    debounceTime(1000), //LO INSERISCO QUANDO PARTE LA CHIMATA CON LA PIPE 
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
            error: err?.message ?? "Errore sconosciuto",
            term,
          }),
        ),
      ),
      

    ),
  );

  readonly vm = toSignal(this.vm$, { initialValue: INITIAL_BRANCH_VM });

  ngOnInit(): void {
    this.vm$.pipe(takeUntilDestroyed(this.destroy))
    
    .subscribe((vm) => console.log("[analytics] vm changed:", vm.term));
    
  }

  

  
}
