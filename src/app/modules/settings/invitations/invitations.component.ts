import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/authorization/services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { TableData } from 'src/app/shared/interfaces/tableData';
import { defaultRoles } from 'src/app/shared/utils/roles';
import { InvitationsService } from '../invitations/invitations.service';

@Component({
  selector: 'wws-settings-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {

  constructor(
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private invitationsService: InvitationsService
  ) {
  }

  invitationsTable: TableData = null;
  
  @ViewChild('actionTemplateAccepted', { static: false }) actionTemplateAccepted!: TemplateRef<any>;
  @ViewChild('actionTemplateExpired', { static: false }) actionTemplateExpired!: TemplateRef<any>;
  @ViewChild('actionTemplatePending', { static: false }) actionTemplatePending!: TemplateRef<any>;

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.invitationsService.getInvitations().subscribe((data) => {
      data.headers.find(h => h.key === 'actions').customTemplates = {
        'acceptedActions': this.actionTemplateAccepted,
        'pendingActions': this.actionTemplatePending,
        'expiredActions': this.actionTemplateExpired
      }
      this.invitationsTable = data;
    });
  }

  acceptInvitation(row){
    this.invitationsService.acceptInvitation(row.id).subscribe((result) => {
      this.handleAcceptResponse(result);
    });
  }
  
  handleAcceptResponse(result) {
    if (result.result) {
      this.toastService.success(result.message);
      this.loadData()
    } else {
      this.toastService.danger(result.message);
    }
  }

  // onInviteUser() {
  //   this.showInviteModal = true;
  //   // this.router.navigate(['invite'], { relativeTo: this.route });
  // }

  // onModalClose(): void {
  //   this.showInviteModal = false;
  //   this.inviteEmail = '';
  //   this.selectedRole = '';
  // }

  // async onSendInvite() {
  //   if (this.inviteEmail && this.selectedRole) {
  //     let data = {
  //       email: this.inviteEmail,
  //       role: this.selectedRole,
  //       invitedBy: this.userSession.getUserData().email,
  //       hostName: window.location.host
  //     };

  //     await this.invitationsService.sendInvitation(data).subscribe((result) => {
  //       this.handleInviteResponse(result);
  //     });
  //   }
  // }

  // handleInviteResponse(result) {
  //   if (result.result) {
  //     this.toastService.success(result.message);
  //     this.onModalClose();
  //   } else {
  //     this.toastService.danger(result.message);
  //     this.onModalClose();
  //   }
  // }
}
