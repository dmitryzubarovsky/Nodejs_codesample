export type FrontendUrlConfig = {
    /**
     * sends after a user confirmed by admin to set password
     */
    setPasswordUrl: string;
    /**
     * sends if user forget password
     */
    resetPasswordUrl: string;
    /**
     * first step to change email, link sends to current email
     */
    changeEmailUrl: string;
    /**
     * second step to change email, link sends to new email
     */
    confirmChangeEmailUrl: string,
    /**
     * invitation link which allows everyone to join a group
     */
    groupInvitationUrl: string,
    /**
     * sends if a group admin invites user to a group
     */
    groupLink: string;

    /**
     * base frontend url
     */
    baseFrontendUrl: string;
};
