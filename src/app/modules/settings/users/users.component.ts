import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/authorization/services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { UsersService } from './users.service';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { defaultRoles } from 'src/app/shared/utils/roles';
import { InvitationsService } from '../invitations/invitations.service';

@Component({
  selector: 'wws-settings-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private userSession: SessionService,
    private translate: TranslateService,
    private usersService: UsersService,
    private invitationsService: InvitationsService
  ) {
  }

  userTable: TableData = null;
  inviteEmail: string = '';
  selectedRole = '';
  showInviteModal: boolean = false;
  roles = defaultRoles;

  @ViewChild('actionTemplateUserActive', { static: false }) actionTemplateUserActive!: TemplateRef<any>;
  @ViewChild('actionTemplateUserInactive', { static: false }) actionTemplateUserInactive!: TemplateRef<any>;
  @ViewChild('actionTemplateInvite', { static: false }) actionTemplateInvite!: TemplateRef<any>;

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((data) => {
      data.headers.find(h => h.key === 'actions').customTemplates = {
        'userActionsActive': this.actionTemplateUserActive,
        'userActionsInactive': this.actionTemplateUserInactive,
        'inviteActions': this.actionTemplateInvite
      }
      this.userTable = data;
    });
  }

  onRowClick(test){
    console.log(test);
  }

  onInviteUser() {
    this.showInviteModal = true;
    // this.router.navigate(['invite'], { relativeTo: this.route });
  }

  onModalClose(): void {
    this.showInviteModal = false;
    this.inviteEmail = '';
    this.selectedRole = '';
  }

  async onSendInvite() {
    if (this.inviteEmail && this.selectedRole) {
      let data = {
        email: this.inviteEmail,
        role: this.selectedRole,
        invitedBy: this.userSession.getUserData().email,
        hostName: window.location.host
      };

      await this.invitationsService.sendInvitation(data).subscribe((result) => {
        this.handleInviteResponse(result);
      });
    }
  }

  handleInviteResponse(result) {
    if (result.result) {
      this.toastService.success(result.message);
      this.onModalClose();
    } else {
      this.toastService.danger(result.message);
      this.onModalClose();
    }
  }
}
