import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';

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
    {
      id: 'main-spaces',
      name: 'Main Spaces',
      types: [
        'Living room', 'Kitchen', 'Living room with open kitchen', 'Living-bedroom with open kitchen',
        'Living room and bedroom', 'Bedroom', 'Bathroom', 'Bathroom with toilet',
        'Attic', 'Extra room'
      ]
    },
    {
      id: 'other-spaces',
      name: 'Other Spaces',
      types: [
        'Salvage', 'Barn', 'Cellar', 'Scullery', 'Toilet room', 'Built-in cupboard larger than 2 m²',
        'Room smaller than 4 m²', 'Washroom', 'Attic storage room with staircase',
        'Attic storage room without fixed staircase', 'Garage', 'Hall, corridor or landing'
      ]
    },
    {
      id: 'outdoor-spaces',
      name: 'Outdoor Spaces',
      types: [
        'Backyard', 'Front yard', 'Side garden', 'Balcony', 'Terrace',
        'Loggia', 'Bicycle storage', 'Communal outdoor space only'
      ]
    }
  ];

  groupedSpaces: Record<string, Space[]> = {};
  showAddSpaceModal: boolean = false;
  selectingGroup: boolean = true;
  collapsedGroups: Record<string, boolean> = {};

  ngOnInit(): void {
    this.groupedSpaces = this.spaceGroups.reduce((acc, group) => {
      acc[group.id] = [];
      return acc;
    }, {} as Record<string, Space[]>);

    this.collapseAll();
  }

  collapseAll(): void {
    Object.keys(this.groupedSpaces).forEach(group => {
      if (!(group in this.collapsedGroups)) {
        this.collapsedGroups[group] = group != Object.keys(this.groupedSpaces)[0]; // Default is expanded
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

  calculateArea(): void {
    this.newSpace.area = this.newSpace.length * this.newSpace.width;
  }

  addNewSpace(): void {
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
}
