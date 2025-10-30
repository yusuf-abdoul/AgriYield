// Contract ABIs for Hedera smart contracts
const AgriYieldABI = [
  // Farm management
  "function createFarm(string name, string description, string location, uint256 fundingGoal, uint256 duration, uint256 yieldPercentage) external returns (uint256)",
  "function getFarm(uint256 farmId) external view returns (tuple(string name, string description, string location, uint256 fundingGoal, uint256 currentFunding, uint256 duration, uint256 yieldPercentage, uint256 createdAt, address farmer, uint8 status))",
  "function getFarmCount() external view returns (uint256)",
  
  // Investment functions
  "function invest(uint256 farmId, uint256 amount) external",
  "function disburseFunds(uint256 farmId) external",
  "function withdrawInvestment(uint256 farmId) external",
  
  // Events
  "event FarmCreated(uint256 indexed farmId, address indexed farmer, string name, uint256 fundingGoal)",
  "event Investment(uint256 indexed farmId, address indexed investor, uint256 amount)",
  "event FundsWithdrawn(uint256 indexed farmId, address indexed farmer, uint256 amount)",
  "event FarmStatusChanged(uint256 indexed farmId, uint8 status)"
];

const FarmSharesABI = [
  // ERC1155 standard functions
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external",
  "function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external",
  
  // Farm shares specific functions
  "function mint(address to, uint256 id, uint256 amount) external",
  "function burn(address from, uint256 id, uint256 amount) external",
  
  // Events
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"
];

const MarketplaceABI = [
  // Listing management
  "function createListing(uint256 farmShareId, uint256 amount, uint256 pricePerShare) external returns (uint256)",
  "function cancelListing(uint256 listingId) external",
  "function buyShares(uint256 listingId, uint256 amount) external",
  
  // View functions
  "function getListing(uint256 listingId) external view returns (tuple(uint256 farmShareId, address seller, uint256 amount, uint256 pricePerShare, bool active))",
  "function getListingCount() external view returns (uint256)",
  
  // Events
  "event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 farmShareId, uint256 amount, uint256 pricePerShare)",
  "event ListingCancelled(uint256 indexed listingId)",
  "event SharesPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice)"
];

const MockUSDTABI = [
  // ERC20 standard functions
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export {
  AgriYieldABI,
  FarmSharesABI,
  MarketplaceABI,
  MockUSDTABI
};