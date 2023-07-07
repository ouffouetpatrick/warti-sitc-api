
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PermissionEntity } from 'src/database/permission/permission.entity';
import { StatutPermissionEntity } from 'src/database/statut_permission/statutPermission.entity';
import { UtilisateurEntity } from 'src/database/utilisateur/utilisateur.entity';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {}

  /**
   * Mail acceptation de la requete
   * @date 07/09/2022 - 11:17:06
   *
   * @async
   * @param {UtilisateurEntity} user
   * @param {PermissionEntity} permission
   * @param {*} data
   * @returns {unknown}
   */

  // Envoie de mail aux admin pour qu'il attribut une visite à qui de droit
  async sendDemandePermission(user: UtilisateurEntity, permission: PermissionEntity, data) {
    // const url = `example.com/auth/confirm?token=${token}`;

    return this.mailerService.sendMail({
      to: [data.resultemail],
      from: '"Support Team" <support@example.com>', // override default from
      subject: '[WARTI]: Demande de permission',
      template: 'mailDemandePermission', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        ...data
      },
    });
  }

  /**
   * Mail acceptation de la requete
   * @date 07/09/2022 - 11:17:06
   *
   * @async
   * @param {StatutPermissionEntity} statutPermissionEntity
   * @param {*} data
   * @returns {unknown}
   */

  // Envoi de mail au receveur de la visite pour qu'il la valide ou pas
  async sendValidationPermission(statutPermissionEntity: StatutPermissionEntity, data) {
    // const url = `example.com/auth/confirm?token=${token}`;

    return this.mailerService.sendMail({
      to: data.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: '[WARTI]: Permission acceptée',
      template: 'mailAccepter', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        ...data
      },
    });
  }

    /**
   * Mail acceptation de la requete
   * @date 07/09/2022 - 11:17:06
   *
   * @async
   * @param {PermissionEntity} permissionEntity
   * @param {*} data
   * @returns {unknown}
   */

  // Envoi de mail au receveur de la visite pour qu'il la valide ou pas
  async sendRejeterPermission(permissionEntity: PermissionEntity, data) {
    // const url = `example.com/auth/confirm?token=${token}`;

    return this.mailerService.sendMail({
      to: data.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: '[WARTI]: Permission rejetée',
      template: 'mailRejeter', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        ...data
      },
    });
  }
  
}