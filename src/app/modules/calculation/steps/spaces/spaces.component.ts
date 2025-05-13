import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { StepHandlerService } from '../step-handler.service';
import { ActivatedRoute } from '@angular/router';
import { CalculationService } from '../../calculation.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

interface Space {
  id: string;
  group: string;
  length: number;
  width: number;
  area: number;
  type: string;
  heating: boolean;
  cooling: boolean;
}

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('modalGrow', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class SpacesComponent {
  spaceGroups = [
  ];

  groupedSpaces: Record<string, Space[]> = {};
  showAddSpaceModal: boolean = false;
  selectingGroup: boolean = true;
  collapsedGroups: Record<string, boolean> = {};
  calculationId: string = '';
  stepId: string = '';
  data: any = null;

  constructor(
    private stepHandler: StepHandlerService,
    private route: ActivatedRoute,
    private calculationService: CalculationService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    const state = history.state;
    this.stepHandler.registerSaveHandler(this.saveStep.bind(this));
    this.calculationId = this.route.parent?.snapshot.paramMap.get('id') || '';
    this.stepId = state?.stepId;

    this.loadSpaceGroups();
  }

  async loadSpaceGroups() {
    return this.calculationService.getSpaceGroups().subscribe({
      next: (groups) => {
        let groupsData = groups.reduce((acc, group) => {
          let groupData = acc.find(g => g.id === group.groupId);
          if (!groupData) {
            groupData = {
              id: group.groupId,
              name: group.groupId == 'main-spaces' ? 'Main Spaces' : group.groupId == 'other-spaces' ? 'Other Spaces' : 'Outdoor Spaces',
              types: []
            };
            acc.push(groupData);
          }
          groupData.types.push({
            id: group.id,
            label: group.typeDesc
          });
          return acc;
        }, []);

        this.spaceGroups = groupsData;

        this.loadData(this.calculationId, this.stepId);
      }
    });
  }

  async loadData(calculationId: string, stepId: string) {
    this.startGrouping();

    let self = this;
    this.calculationService.getStepData(calculationId, stepId).subscribe({
      next: (dataObj) => {
        self.data = dataObj;
        if (dataObj && dataObj.length > 0) {
          self.groupedSpaces = dataObj.reduce((acc, space) => {
            let groupId = self.getGroupId(space.spaceTypeId);
            if (!(groupId in acc)) {
              acc[groupId] = [];
            }
            acc[groupId].push({
              group: groupId,
              length: space.length,
              width: space.width,
              area: space.squareArea,
              type: space.spaceTypeId,
              heating: space.heating,
              cooling: space.cooling
            });
            return acc;
          }, {} as Record<string, Space[]>);
        }
      },
      error: (error) => {
        console.error('Could not load step data');
      }
    });
  }

  startGrouping(): void {
    this.groupedSpaces = this.spaceGroups.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {} as Record<string, Space[]>);

    this.collapseAll();
  }

  ngOnDestroy(): void {
    this.stepHandler.clearHandler();
  }
  
  getGroupId(type: string): string {
    return this.spaceGroups.find(g => g.types.find(t => t.id === type))?.id || '';
  }
  
  saveStep() {
    if (!this.validateNextPage()) {
      return Promise.resolve({ success: false });
    }

    return new Promise((resolve) => {
      this.calculationService.saveStepStep(this.calculationId, this.stepId, this.buildPostData()).subscribe({ 
        next: (data) => {
          if (data.success) {
            this.toastService.success('Step saved successfully');
            resolve({ success: true });
          } else {
            this.toastService.warning(data.message);
            resolve({ success: false, message: 'Could not save step: ' + this.stepId });
          }
        },
        error: (error) => {
          this.toastService.warning('Could not save step: ' + this.stepId);
          resolve({ success: false, message: 'Could not save step: ' + this.stepId });
        },
      });
    });
  }

  collapseAll(): void {
    Object.keys(this.groupedSpaces).forEach(group => {
      if (!(group in this.collapsedGroups)) {
        this.collapsedGroups[group] = group != Object.keys(this.groupedSpaces)[0];
      }
    });
  }

  toggleCollapse(group: string): void {
    this.collapsedGroups[group] = !this.collapsedGroups[group];
  }

  toggleFeature(space: Space, feature: 'heating' | 'cooling'): void {
    space[feature] = !space[feature];
  }

  deleteSpace(space: Space): void {
    this.groupedSpaces[space.group] = this.groupedSpaces[space.group].filter(s => s !== space);
  }

  getGroupName(group: string): string {
    return this.spaceGroups.find(g => g.id === group)?.name || '';
  }

  showGroup(group: string): boolean {
    return this.groupedSpaces[group].length > 0;
  }

  newSpace: Space = {
    id: '',
    group: '',
    length: 0,
    width: 0,
    area: 0,
    type: '',
    heating: false,
    cooling: false
  };

  openAddSpaceModal(): void {
    this.selectingGroup = true;
    this.showAddSpaceModal = true;
  }

  closeAddSpaceModal(): void {
    this.resetForm();
    this.showAddSpaceModal = false;
  }

  selectSpaceGroup(group: string): void {
    this.newSpace.group = group;
    this.newSpace.type = this.spaceGroups.find(g => g.id === group)?.types[0] || '';
    setTimeout(() => {
      this.selectingGroup = false;
    }, 200);
  }

  getGroupOptions(selectedGroup): string[] {
    return this.spaceGroups.find(g => g.id === selectedGroup)?.types
  }

  showHeatingCooling(selectedGroup): boolean {
    return this.spaceGroups.find(g => g.id === selectedGroup)?.id != 'outdoor-spaces';
  }

  calculateArea(): void {
    this.newSpace.area = this.newSpace.length * this.newSpace.width;
  }

  addNewSpace(): void {
    console.log(this.newSpace)
    console.log(this.groupedSpaces)
    if (this.newSpace.length > 0 && this.newSpace.width > 0) {
      this.groupedSpaces[this.newSpace.group].push({ ...this.newSpace });
      this.closeAddSpaceModal();

      this.collapseAll();
      this.toggleCollapse(this.newSpace.group);
    }
  }

  resetForm(): void {
    this.selectingGroup = true;
    this.newSpace = {
      id: '',
      group: '',
      length: 0,
      width: 0,
      area: 0,
      type: '',
      heating: false,
      cooling: false
    };
  }

  getSpaceTypeName(type: string): string {
    return this.spaceGroups.find(g => g.types.find(t => t.id === type))?.types.find(t => t.id === type)?.label || '';
  }


  validateNextPage(): boolean {
    if (Object.values(this.groupedSpaces).flat().length === 0) {
      this.toastService.warning('Please add at least one space');
      return false;
    }

    return true;
  }

  buildPostData(): any {
    return Object.values(this.groupedSpaces).flat().map(space => ({
      calculationId: this.calculationId,
      length: space.length,
      width: space.width,
      squareArea: space.area,
      heating: space.heating,
      cooling: space.cooling,
      spaceTypeId: space.type
    }))
  }
}
