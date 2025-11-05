/**
 * Defines the logical order of documentation pages based on the EVVM docs menu structure.
 * Pages are ordered by their URL path to maintain the documentation's hierarchy.
 */
export const PAGE_ORDER = [
  // Introduction & Getting Started
  '/docs/intro',
  '/docs/QuickStart',
  '/docs/ProcessOfATransaction',

  // EVVM Core Contract
  '/docs/category/evvm-core-contract',
  '/docs/EVVM/Introduction',
  '/docs/EVVM/NonceTypes',

  // Payment Functions
  '/docs/category/payment-functions',
  '/docs/EVVM/PaymentFunctions/pay',
  '/docs/EVVM/PaymentFunctions/payMultiple',
  '/docs/EVVM/PaymentFunctions/dispersePay',
  '/docs/EVVM/PaymentFunctions/caPay',
  '/docs/EVVM/PaymentFunctions/disperseCaPay',
  '/docs/category/legacy-single-payment-functions',
  '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/Introduction',
  '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/payStaker',
  '/docs/EVVM/PaymentFunctions/SinglePaymentFunctions/payNoStaker',

  // Other EVVM Core Functions
  '/docs/EVVM/Getters',
  '/docs/EVVM/AdminFunctions',
  '/docs/EVVM/IdentityResolution',
  '/docs/EVVM/EconomicSystem',
  '/docs/EVVM/StakingIntegration',
  '/docs/EVVM/ProxyManagement',
  '/docs/EVVM/TreasuryFunctions',

  // Staking Service
  '/docs/category/staking-service',
  '/docs/Staking/Introduction',
  '/docs/category/staking-contract',

  // Staking Functions
  '/docs/category/staking-functions',
  '/docs/Staking/StakingContract/StakingFunctions/goldenStaking',
  '/docs/Staking/StakingContract/StakingFunctions/presaleStaking',
  '/docs/Staking/StakingContract/StakingFunctions/publicStaking',

  // Service Staking
  '/docs/category/service-staking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/Introduction',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/prepareServiceStaking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/confirmServiceStaking',
  '/docs/Staking/StakingContract/StakingFunctions/serviceStaking/serviceUnstaking',

  // Internal Staking Functions
  '/docs/category/internal-staking-functions',
  '/docs/Staking/StakingContract/InternalStakingFunctions/presaleClaims',
  '/docs/Staking/StakingContract/InternalStakingFunctions/stakingBaseProcess',

  // Other Staking Contract Functions
  '/docs/Staking/StakingContract/AdminFunctions',
  '/docs/Staking/StakingContract/makeCaPay',
  '/docs/Staking/StakingContract/makePay',
  '/docs/Staking/StakingContract/Getters',
  '/docs/Staking/StakingContract/HistoryAndTimeLocks',

  // Estimator Contract
  '/docs/category/estimator-contract',
  '/docs/Staking/Estimator/notifyNewEpoch',
  '/docs/Staking/Estimator/makeEstimation',
  '/docs/Staking/Estimator/AdminFunctions',

  // Name Service
  '/docs/category/name-service',
  '/docs/NameService/Introduction',

  // Username Functions
  '/docs/category/username-functions',
  '/docs/NameService/UsernameFunctions/preRegistrationUsername',
  '/docs/NameService/UsernameFunctions/registrationUsername',
  '/docs/NameService/UsernameFunctions/makeOffer',
  '/docs/NameService/UsernameFunctions/withdrawOffer',
  '/docs/NameService/UsernameFunctions/acceptOffer',
  '/docs/NameService/UsernameFunctions/renewUsername',

  // Custom Metadata Functions
  '/docs/category/custom-metadata-functions',
  '/docs/NameService/CustomMetadataFunctions/AddCustomMetadata',
  '/docs/NameService/CustomMetadataFunctions/RemoveCustomMetadata',
  '/docs/NameService/CustomMetadataFunctions/FlushCustomMetadata',
  '/docs/NameService/CustomMetadataFunctions/FlushUsername',

  // Name Service Admin & Getters
  '/docs/NameService/AdminFunctions',
  '/docs/NameService/GetterFunctions',

  // Treasury System
  '/docs/category/treasury-system',
  '/docs/Treasury/Introduction',

  // Simple Treasury
  '/docs/category/simple-treasury',
  '/docs/Treasury/TreasurySimple/Introduction',
  '/docs/Treasury/TreasurySimple/deposit',
  '/docs/Treasury/TreasurySimple/withdraw',

  // Crosschain Treasury
  '/docs/category/crosschain-treasury',
  '/docs/Treasury/TreasuryCrosschain/Introduction',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/withdraw',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/fisherBridgeReceive',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/fisherBridgeSend',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/setExternalChainAddress',
  '/docs/Treasury/TreasuryCrosschain/HostChainStation/AdminFunctions',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/depositERC20',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/depositCoin',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeReceive',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeSendERC20',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/fisherBridgeSendCoin',
  '/docs/Treasury/TreasuryCrosschain/ExternalChainStation/AdminFunctions',

  // How to Create Service
  '/docs/HowToMakeAEVVMService',

  // Signature Structures
  '/docs/category/signature-structures',
  '/docs/SignatureStructures/Introduction',

  // EVVM Signature Structures
  '/docs/category/evvm-contract',
  '/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure',
  '/docs/SignatureStructures/EVVM/DispersePaySignatureStructure',
  '/docs/SignatureStructures/EVVM/WithdrawalPaymentSignatureStructure',

  // Name Service Signature Structures
  '/docs/category/name-service-signature-structures',
  '/docs/SignatureStructures/NameService/preRegistrationUsernameStructure',
  '/docs/SignatureStructures/NameService/registrationUsernameStructure',
  '/docs/SignatureStructures/NameService/makeOfferStructure',
  '/docs/SignatureStructures/NameService/withdrawOfferStructure',
  '/docs/SignatureStructures/NameService/acceptOfferStructure',
  '/docs/SignatureStructures/NameService/renewUsernameStructure',
  '/docs/SignatureStructures/NameService/addCustomMetadataStructure',
  '/docs/SignatureStructures/NameService/removeCustomMetadataStructure',
  '/docs/SignatureStructures/NameService/flushCustomMetadataStructure',
  '/docs/SignatureStructures/NameService/flushUsernameStructure',

  // Staking Service Signature Structures
  '/docs/category/staking-service-signature-structures',
  '/docs/SignatureStructures/Staking/StandardStakingStructure',

  // Treasury Signature Structures
  '/docs/SignatureStructures/Treasury/FisherBridgeSignatureStructure',

  // Testnet Functions
  '/docs/TestnetExclusiveFunctions',

  // Registry EVVM Contract
  '/docs/category/registry-evvm-contract',
  '/docs/RegistryEvvm/Introduction',

  // Registration Functions
  '/docs/RegistryEvvm/RegistrationFunctions/registerEvvm',
  '/docs/RegistryEvvm/RegistrationFunctions/sudoRegisterEvvm',

  // SuperUser Governance
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/proposeSuperUser',
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/rejectProposalSuperUser',
  '/docs/RegistryEvvm/GovernanceFunctions/SuperUserGovernance/acceptSuperUser',

  // Upgrade Governance
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/proposeUpgrade',
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/rejectProposalUpgrade',
  '/docs/RegistryEvvm/GovernanceFunctions/UpgradeGovernance/acceptProposalUpgrade',

  // Registry Admin Functions
  '/docs/RegistryEvvm/AdminFunctions/registerChainId',
  '/docs/RegistryEvvm/AdminFunctions/authorizeUpgrade',

  // Registry Getter Functions
  '/docs/RegistryEvvm/GetterFunctions/getEvvmIdMetadata',
  '/docs/RegistryEvvm/GetterFunctions/getWhiteListedEvvmIdActive',
  '/docs/RegistryEvvm/GetterFunctions/getPublicEvvmIdActive',
  '/docs/RegistryEvvm/GetterFunctions/getSuperUserData',
  '/docs/RegistryEvvm/GetterFunctions/getSuperUser',
  '/docs/RegistryEvvm/GetterFunctions/isChainIdRegistered',
  '/docs/RegistryEvvm/GetterFunctions/isAddressRegistered',
  '/docs/RegistryEvvm/GetterFunctions/getUpgradeProposalData',
  '/docs/RegistryEvvm/GetterFunctions/getVersion',

  // NPM Libraries
  '/docs/npm-libraries',
  '/docs/category/evvmviem-signature-library',
  '/docs/npmLibraries/viemSignatureLibrary/introduction',
  '/docs/npmLibraries/viemSignatureLibrary/abi',
  '/docs/npmLibraries/viemSignatureLibrary/signature-builders',
  '/docs/npmLibraries/viemSignatureLibrary/types',
  '/docs/npmLibraries/viemSignatureLibrary/utils',
  '/docs/npmLibraries/testnetContracts',

  // Frontend Tooling & License
  '/docs/EVVMFrontendTooling',
  '/docs/EVVMNoncommercialLicense',
];

/**
 * Returns a sort function that orders pages by the defined PAGE_ORDER.
 * Pages not in the order list will appear at the end, sorted alphabetically.
 */
export function getPageOrderComparator() {
  return (a: { url: string }, b: { url: string }) => {
    // Extract path from full URL (remove domain)
    const pathA = a.url.replace('https://www.evvm.info', '');
    const pathB = b.url.replace('https://www.evvm.info', '');

    const indexA = PAGE_ORDER.indexOf(pathA);
    const indexB = PAGE_ORDER.indexOf(pathB);

    // If both are in the order list, sort by their index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only A is in the list, it comes first
    if (indexA !== -1) return -1;

    // If only B is in the list, it comes first
    if (indexB !== -1) return 1;

    // If neither is in the list, sort alphabetically by URL
    return pathA.localeCompare(pathB);
  };
}
