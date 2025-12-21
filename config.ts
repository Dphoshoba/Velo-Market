
export interface MarketplaceConfig {
  name: string;
  brandName: string;
  tagline: string;
  primaryColor: string;
  logoText: string;
  supportEmail: string;
  defaultCommission: number;
  deploymentMode: 'demo' | 'production';
  features: {
    enableAiDescriptions: boolean;
    enableAiImages: boolean;
    enableGlobalSearch: boolean;
  };
}

export const CURRENT_CONFIG: MarketplaceConfig = {
  name: "VeloMarket",
  brandName: "VELO",
  tagline: "Artisanal Excellence, Directly Shared.",
  primaryColor: "indigo",
  logoText: "V",
  supportEmail: "support@velomarket.com",
  defaultCommission: 10,
  deploymentMode: 'demo', // Switch to 'production' when API is connected
  features: {
    enableAiDescriptions: true,
    enableAiImages: true,
    enableGlobalSearch: true
  }
};
