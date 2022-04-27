import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, interval, Subject } from "rxjs";
import { startWith, switchMap, takeUntil } from "rxjs/operators";
import { Netquery } from "src/app/services";
import { IProfileStats, ProcessGroup } from "src/app/services/connection-tracker.service";

@Component({
  selector: 'app-network-activity-widget',
  templateUrl: './network-activity-widget.html',
  styleUrls: ['./network-activity-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkActivityWidget implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  /** @private All process-groups/profiles that are currently active. */
  profiles: IProfileStats[] = [];

  /** @private Emits the search string whenever the user changes the search-input */
  onSearch = new BehaviorSubject<string>('');

  /** @private Whether or not we are still loading data. */
  loading = true;

  /** @private Whether or not the search bar is shown */
  showSearch = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private netquery: Netquery,
  ) { }

  /**
   * @private
   * Toggle Whether or not the search bar is visible.
   * If the search bar gets hidden make sure to clear the
   * current search as well.
   */
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch && this.onSearch.getValue() != '') {
      this.search('')
    }
  }

  /**
   * @private
   * Called by ngModelChange from our search-input to trigger
   * a new profile-search.
   *
   * @param s The search string from the input
   */
  search(s: string) {
    this.onSearch.next(s);
  }

  /**
   * @private
   * Callback for the (keydown) binding on the document.
   * Used to handle ESC key presses correctly
   *
   * @param event The key-up event
   */
  onSearchKeyDown(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === 'Escape' && this.showSearch) {
      this.toggleSearch();
    }
  }

  /**
   * @private
   * {@type TrackByFunction} for the process-groups.
   */
  trackProfile(_: number, p: IProfileStats) {
    return p.ID;
  }

  ngOnInit(): void {
    combineLatest([
      interval(10000).pipe(
        startWith(-1),
        switchMap(() => this.netquery.getProfileStats())
      ),
      this.onSearch,            // emits the search text of the user
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([p, search]) => {
        this.loading = false;
        this.profiles = p
          .filter(profile => {
            return search === '' || profile.Name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          })
          .sort((a, b) => {
            return b.size - a.size;
          });


        this.cdr.markForCheck();
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
