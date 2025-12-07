import type { ReactNode } from 'react';
import {
	ConsentManagerDialog,
	ConsentManagerProvider,
	CookieBanner,
} from '@c15t/nextjs';
// For client-only apps (non-SSR), you can use:
// import { ConsentManagerProvider } from '@c15t/nextjs/client';
import { ConsentManagerClient } from './consent-manager.client';

/**
 * Server-side rendered consent management wrapper for Next.js App Router
 *
 * This component provides SSR-compatible consent management by separating
 * server-side configuration from client-side functionality. The server handles
 * initial setup and configuration, while client-side features (callbacks,
 * scripts) are delegated to the ConsentManagerClient component.
 *
 * @param props - Component properties
 * @param props.children - Child components to render within the consent manager context
 *
 * @returns The consent manager provider with banner, dialog, and client wrapper
 *
 * @remarks
 * This split architecture is necessary because certain options like callbacks
 * and scripts cannot be serialized during server-side rendering. For
 * client-only implementations, use `<ConsentManagerProvider />` from
 * `@c15t/nextjs/client`.
 *
 * @example
 * ```tsx
 * // In your root layout.tsx
 * import { ConsentManager } from './consent-manager';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ConsentManager>
 *           {children}
 *         </ConsentManager>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ConsentManager({ children }: { children: ReactNode }) {
	return (
		<ConsentManagerProvider
			options={{
				translations: {
					defaultLanguage: 'ru',
					translations: {
          ru: {
            common: {
              acceptAll: 'Принять',
			 rejectAll: 'Только необходимые',
			 customize: 'Настройки',
			 save: 'Сохранить',
            },
            cookieBanner: {
              title: 'Мы используем cookie',
              description: 'Этот сайт использует файлы cookie для обеспечения работы сервиса, улучшения пользовательского опыта и анализа трафика.',
			  
            },
			consentTypes: {
				marketing: {
					title: 'Маркетинг',
					description: 'Мы используем рекламные cookie для рекламы.',
				}, 
				necessary: {
					title: 'Необходимые',
					description: 'Необходимые cookie обеспечивают базовую функциональность сайта.',
				},
				
				
			},
			consentManagerDialog: {
				title: 'Настройки cookie',
				description: 'Выберите, какие cookie вы хотите разрешить.',

			
				
			},
			
				
          },
        },
				},
				mode: 'c15t',
				backendURL: '/api/c15t',
				consentCategories: ['necessary', 'marketing'], // Optional: Specify which consent categories to show in the banner. 
				ignoreGeoLocation: true, // Useful for development to always view the banner.
				}}
		>
			<CookieBanner />
			<ConsentManagerDialog />
			<ConsentManagerClient>{children}</ConsentManagerClient>
		</ConsentManagerProvider>
	);
}
