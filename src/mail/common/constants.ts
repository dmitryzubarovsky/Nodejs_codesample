import { EmailTypeEnum, GroupsUsersEnum, GroupsUsersRoleEnum } from '../../common/enums';

export const queries = {
  [EmailTypeEnum.REGISTRATION]: `SELECT  id AS "userId",
                         full_name AS "fullName"
                   FROM users
                   WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.INVITE]: `SELECT  id AS "userId",
                           full_name AS "fullName"
                     FROM users
                     WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.INVITE]: `SELECT full_name AS "fullName",
             g.name AS "groupName",
             g.id  AS "groupId"
             FROM users
             LEFT JOIN group_users gu 
                ON users.id = gu.user_id
                AND gu.status = 'Sent'
                AND gu.deleted_at IS NULL
             LEFT JOIN groups g 
                ON gu.group_id = g.id
                AND g.deleted_at IS NULL
             WHERE users.id = $1 AND gu.group_id = $2`,

  [EmailTypeEnum.CHANGE_EMAIL]: `SELECT full_name AS "fullName",
                        $2       AS email,
                        users.id AS "userId"
                     FROM users
                     WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.FORGOT_PASSWORD]: `SELECT id AS "userId",
                          full_name AS "fullName"
                     FROM users
                     WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.CONFIRM_EMAIL]: `SELECT id AS "userId",
                           full_name AS "fullName"    
                     FROM users
                     WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.ADMIN_CONFIRM_EMAIL]: `SELECT id AS "adminId",
                           full_name AS "fullName"    
                     FROM admins
                     WHERE admins.id = $1 AND admins.deleted_at IS NULL`,

  [EmailTypeEnum.REMINDER]: `SELECT id AS "userId",
                           full_name AS "fullName"    
                     FROM users
                     WHERE users.id = $1 AND users.deleted_at IS NULL`,

  [EmailTypeEnum.ADD_GROUP_MEMBER]: `SELECT full_name AS "fullName",
             g.name AS "groupName",
             g.id  AS "groupId"
             FROM users
             LEFT JOIN group_users gu 
                ON users.id = gu.user_id
                AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                AND gu.deleted_at IS NULL
             LEFT JOIN groups g 
                ON gu.group_id = g.id
                AND g.deleted_at IS NULL
             WHERE users.id = $1 AND gu.group_id = $2`,

  [EmailTypeEnum.UNGROUP]: `
  SELECT full_name  AS "fullName",
             g.name AS "groupName",
             g.id   AS "groupId"
             FROM users
             LEFT JOIN group_users gu 
                ON users.id = gu.user_id
                AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                AND gu.deleted_at IS NOT NULL
             LEFT JOIN groups g 
                ON gu.group_id = g.id
                AND g.deleted_at IS NULL
             WHERE users.id = $1 AND gu.group_id = $2`,

  [EmailTypeEnum.GROUP_BLOCKED]: `
  SELECT full_name  AS "fullName",
             g.name AS "groupName",
             g.id   AS "groupId"
             FROM users
             LEFT JOIN group_users gu 
                ON users.id = gu.user_id
                AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                AND gu.role = '${GroupsUsersRoleEnum.ADMIN}'
                AND gu.deleted_at IS NULL
             LEFT JOIN groups g 
                ON gu.group_id = g.id
                AND g.deleted_at IS NULL
             WHERE users.id = $1 AND gu.group_id = $2`,
};

export const subjects = {
  [EmailTypeEnum.REGISTRATION]: 'Registration mail',

  [EmailTypeEnum.INVITE]: 'Invite to group',

  [EmailTypeEnum.CHANGE_EMAIL]: 'Confirm change email',

  [EmailTypeEnum.FORGOT_PASSWORD]: 'Forgot password',

  [EmailTypeEnum.CONFIRM_EMAIL]: 'Confirm new email',

  [EmailTypeEnum.ADMIN_CONFIRM_EMAIL]: 'Confirm new email',

  [EmailTypeEnum.REMINDER]: 'Reminder',

  [EmailTypeEnum.ADD_GROUP_MEMBER]: 'Join to group',

  [EmailTypeEnum.UNGROUP]: 'Ungroup',

  [EmailTypeEnum.GROUP_BLOCKED]: 'Blocked group',
};

export const emails = {
  registration: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}}, you have successfully registered in Empreendedor Fluency and able to set a password using the link: {{registration}}</p>
    <br>
    </body>
    <html>`,
  confirmEmail: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br> <p>Hey, {{fullName}}, please, confirm your email changing by this link: {{confirmEmail}}</p>
    <br>
    </body>
    <html>`,
  changeEmail: `
     <!DOCTYPE html>
    <html>
    <head>
        <meta charset= \\"utf-8\\" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}},we got your change-email request. Use this link to set new email: {{changeEmail}}</p>
    <br>
    </body>
    <html>`,
  forgotPassword: `
     <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}},tap on this link to set new password: {{forgotPassword}}
    </p>
    <br>
    </body>
    <html>`,
  invite: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br> <p>Hey, {{fullName}}, you got an invitation to join {{groupName}} group. You can accept or decline the invitation using this link: {{invite}}</p>
    <br>
    </body>
    <html>`,
  reminder: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}}, please, upload your MEI to send invoices</p>
    <br>
    </body>
    <html>`,
  adminConfirmEmail: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}}, please, confirm your email changing by this link: {{adminConfirmEmail}}</p>
    <br>
    </body>
    <html>`,
  addGroupMember: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br> <p>Hey, {{fullName}}, you have been added to the {{groupName}} group. You can view the group: {{groupLink}}</p>
    <br>
    </body>
    <html>
  `,

  ungroup: `
   <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}}, you was ungrouped from {{groupName}}. </p>
    <br>
    </body>
    <html>`,

  groupBlock: `
   <!DOCTYPE html>
    <html>
    <head>
        <meta charset= "utf-8" />
    </head>
    <body>
    <br>
    <p>Hey, {{fullName}}, your group {{groupName}} was blocked. Please contact the administrator </p>
    <br>
    </body>
    <html>`,
};
