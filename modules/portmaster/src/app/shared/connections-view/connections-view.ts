import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { AppProfile, getAppSetting, ScopeTranslation, setAppSetting, Verdict } from 'src/app/services';
import { AppProfileService } from 'src/app/services/app-profile.service';
import { InspectedProfile, ScopeGroup } from 'src/app/services/connection-tracker.service';
import { deepClone } from '../utils';

@Component({
  selector: 'app-connections-view',
  templateUrl: './connections-view.html',
  styleUrls: ['./connections-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionsViewComponent {
  readonly scopeTranslation = ScopeTranslation;
  readonly displayedColumns = ['state', 'reason', 'entity', 'started', 'ended'];
  readonly verdict = Verdict;

  trackByScope: TrackByFunction<ScopeGroup> = (_: number, g: ScopeGroup) => g.scope;

  //groups: Group[] = [];
  blockedDomains: string[] | null = null;

  @Input()
  set profile(p: AppProfile | null) {
    this._profile = p;
    this.blockedDomains = null;

    if (!!p) {
      this.collectBlockedDomains();
    }
  }
  get profile() {
    return this._profile
  }
  private _profile: AppProfile | null = null;

  @Input()
  connections: InspectedProfile | null = null;

  constructor(private profileService: AppProfileService) { }

  blockAll(event: Event, grp: ScopeGroup) {
    event.preventDefault();
    event.stopPropagation();

    if (!grp.domain) {
      // scope blocking not yet supported
      return
    }

    if (this.isScopeBlocked(grp)) {
      return;
    }

    const newRule = `- ${grp.scope}`;

    this.updateRules(newRule, true);
  }

  unblockAll(event: Event, grp: ScopeGroup) {
    event.preventDefault();
    event.stopPropagation();

    if (!grp.domain) {
      // scope blocking not yet supported
      return
    }

    if (!this.isScopeBlocked(grp)) {
      return;
    }

    const newRule = `- ${grp.scope}`;

    this.updateRules(newRule, false);
  }

  isScopeBlocked(grp: ScopeGroup) {
    // blocked domains are not yet loaded
    if (this.blockedDomains === null) {
      return false;
    }

    if (!!grp.domain) {
      return this.blockedDomains.some(rule => grp.scope === rule);
    } else {
      // TODO(ppacher): correctly handle all other scopes here.
    }

    return false;
  }

  private updateRules(newRule: string, add: boolean) {
    if (!this.profile) {
      return
    }

    let rules = getAppSetting<string[]>(this.profile!.Config, 'filter/endpoints') || [];
    rules = rules.filter(rule => rule !== newRule);

    if (add) {
      rules.splice(0, 0, newRule)
    }

    const profile = deepClone(this.profile!);
    setAppSetting(profile.Config, 'filter/endpoints', rules);

    this.profileService.saveLocalProfile(profile)
      .subscribe();
  }

  private collectBlockedDomains() {
    let blockedDomains = new Set<string>();

    const rules = getAppSetting<string[]>(this.profile!.Config, 'filter/endpoints') || [];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (rule.startsWith('+ ')) {
        break;
      }

      blockedDomains.add(rule.substr(2))
    }

    this.blockedDomains = Array.from(blockedDomains)

  }
}
