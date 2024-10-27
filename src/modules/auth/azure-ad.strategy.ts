// azure-ad.strategy.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { cfg } from '../../config/env.config';

const config = {
	credentials: {
		tenantID: cfg('TENANT_ID'),
		clientID: cfg('CLIENT_ID'),
		clientSecret: cfg('CLIENT_SECRET'),
	},
	metadata: {
		authority: 'login.microsoftonline.com',
		discovery: '.well-known/openid-configuration',
		version: 'v2.0',
	},
	settings: {
		validateIssuer: true,
		passReqToCallback: false,
		loggingLevel: 'info',
	},
};

// const EXPOSED_SCOPES = ['openid', 'profile', 'email', 'User.Read']; //provide a scope of your azure AD.
@Injectable()
export class AzureAdStrategy extends PassportStrategy(BearerStrategy, 'azure-ad-bearer') {
	constructor() {
		super({
			identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
			issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
			clientID: config.credentials.clientID,
			validateIssuer: config.settings.validateIssuer,
			passReqToCallback: config.settings.passReqToCallback,
			loggingLevel: config.settings.loggingLevel,
			loggingNoPII: false,
			skipUserProfile: true,
			useCookieInsteadOfSession: false,
		});
	}

	async validate(profile: any): Promise<any> {
		console.log('profile');

		// Implement user validation and extraction of necessary user information from profile
		// Example: Extract and store user details in a session
		return profile;
	}
}
export const AzureADGuard = AuthGuard('azure-ad-bearer');
