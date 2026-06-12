/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Constants
 * Dictionaries, character sets, compute power presets, and
 * simulated user database definitions.
 * ============================================================
 */

/** Top-100 most common passwords for dictionary simulation */
export const COMMON_PASSWORDS = [
  'password', '123456', '123456789', '12345678', '12345',
  'qwerty', 'abc123', 'monkey', '1234567', 'letmein',
  'trustno1', 'dragon', 'baseball', 'iloveyou', 'master',
  'sunshine', 'ashley', 'michael', 'shadow', '123123',
  'football', 'access', 'hello', 'charlie', 'donald',
  'password1', 'qwerty123', 'admin', 'welcome', 'login',
  'starwars', 'solo', 'master', 'princess', 'passw0rd',
  '654321', 'superman', 'qazwsx', 'michael', 'football',
  'password123', 'admin123', 'root', '1234', 'abcd1234',
  'test', 'pass', 'pass123', 'pa55word', 'p@ssw0rd',
  'zaq1xsw2', 'qwer1234', 'asdfgh', 'zxcvbn', '1q2w3e',
  'secret', 'love', 'god', 'guerra', 'angel',
  'junior', 'andrea', 'matrix', 'killer', 'robert',
  'alexander', 'daniel', 'hannah', 'jessica', 'jordan',
  'summer', 'nicole', 'buster', 'pepper', 'george',
  'tigger', 'joshua', 'maggie', 'jennifer', 'amanda',
  'abcdef', 'computer', 'internet', 'soccer', 'hockey',
  'lakers', 'cowboys', 'midnight', 'running', 'thunder',
  'flower', 'mustang', 'london', 'diamond', 'yellow',
  'banana', 'coffee', 'chicken', 'freedom', 'whatever'
];

/** Character set definitions */
export const CHARSETS = {
  lowercase: { label: 'Minúsculas (a-z)', chars: 'abcdefghijklmnopqrstuvwxyz', size: 26 },
  uppercase: { label: 'Mayúsculas (A-Z)', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', size: 26 },
  numbers:   { label: 'Números (0-9)',     chars: '0123456789',               size: 10 },
  symbols:   { label: 'Símbolos (!@#...)', chars: '!@#$%^&*()-_=+[]{}|;:,.<>?/~`', size: 30 }
};

/**
 * Compute power presets (passwords per second).
 * These are approximate real-world benchmarks for SHA-256.
 */
export const COMPUTE_PRESETS = {
  personal: {
    label: 'PC Personal',
    icon: '💻',
    speed: 1_000_000,          // 1 million/s
    description: 'Equipo doméstico con GPU básica'
  },
  server: {
    label: 'Servidor',
    icon: '🖥️',
    speed: 1_000_000_000,      // 1 billion/s
    description: 'Servidor dedicado con múltiples GPUs'
  },
  supercomputer: {
    label: 'Supercomputadora',
    icon: '🏢',
    speed: 1_000_000_000_000,  // 1 trillion/s
    description: 'Supercomputadora tipo Summit/Frontier'
  },
  quantum: {
    label: 'Cuántica (Hipotética)',
    icon: '⚛️',
    speed: 1_000_000_000_000_000, // 1 quadrillion/s
    description: 'Computadora cuántica teórica con Grover'
  }
};

/** Simulated users for the banking portal and lab */
export const SIMULATED_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    fullName: 'Administrador del Sistema',
    role: 'Administrador',
    avatar: '👤',
    strengthCategory: 'weak'
  },
  {
    username: 'carlos.mendez',
    password: 'C@rl0s#2024!Mx',
    fullName: 'Carlos Méndez Rivera',
    role: 'Gerente de Operaciones',
    avatar: '👨‍💼',
    strengthCategory: 'strong'
  },
  {
    username: 'ana.garcia',
    password: 'password',
    fullName: 'Ana García López',
    role: 'Analista Financiera',
    avatar: '👩‍💻',
    strengthCategory: 'critical'
  },
  {
    username: 'roberto.silva',
    password: 'R0b3rt0$ilv@#2024',
    fullName: 'Roberto Silva Torres',
    role: 'Director de Seguridad',
    avatar: '🛡️',
    strengthCategory: 'very-strong'
  },
  {
    username: 'maria.lopez',
    password: '123456',
    fullName: 'María López Hernández',
    role: 'Cajera Principal',
    avatar: '👩',
    strengthCategory: 'critical'
  },
  {
    username: 'david.ruiz',
    password: 'D4v!d_Ru1z_S3cur3',
    fullName: 'David Ruiz Morales',
    role: 'Ingeniero de Sistemas',
    avatar: '👨‍🔧',
    strengthCategory: 'strong'
  }
];

/** Simulated bank transactions */
export const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', date: '2024-12-10', description: 'Transferencia SPEI', amount: -15000.00, type: 'debit' },
  { id: 'TXN-002', date: '2024-12-09', description: 'Depósito Nómina', amount: 42000.00, type: 'credit' },
  { id: 'TXN-003', date: '2024-12-08', description: 'Pago Servicios CFE', amount: -1250.00, type: 'debit' },
  { id: 'TXN-004', date: '2024-12-07', description: 'Compra Amazon MX', amount: -3499.99, type: 'debit' },
  { id: 'TXN-005', date: '2024-12-06', description: 'Transferencia Recibida', amount: 8500.00, type: 'credit' },
  { id: 'TXN-006', date: '2024-12-05', description: 'Pago Tarjeta Crédito', amount: -7800.00, type: 'debit' },
  { id: 'TXN-007', date: '2024-12-04', description: 'Retiro Cajero ATM', amount: -5000.00, type: 'debit' },
  { id: 'TXN-008', date: '2024-12-03', description: 'Pago Netflix', amount: -299.00, type: 'debit' },
];

/** Time comparison milestones for dramatic scale */
export const TIME_COMPARISONS = [
  { seconds: 1,                    label: '1 segundo',                icon: '⚡' },
  { seconds: 60,                   label: '1 minuto',                 icon: '⏱️' },
  { seconds: 3600,                 label: '1 hora',                   icon: '🕐' },
  { seconds: 86400,                label: '1 día',                    icon: '📅' },
  { seconds: 604800,               label: '1 semana',                 icon: '📆' },
  { seconds: 2592000,              label: '1 mes',                    icon: '🗓️' },
  { seconds: 31536000,             label: '1 año',                    icon: '📊' },
  { seconds: 315360000,            label: '10 años',                  icon: '🔟' },
  { seconds: 3153600000,           label: '100 años (vida humana)',    icon: '👴' },
  { seconds: 31536000000,          label: '1,000 años',               icon: '🏰' },
  { seconds: 315360000000,         label: '10,000 años (civilización)', icon: '🏛️' },
  { seconds: 3153600000000,        label: '100,000 años',             icon: '🌍' },
  { seconds: 31536000000000,       label: '1 millón de años',         icon: '🦕' },
  { seconds: 315360000000000,      label: '10 millones de años',      icon: '🌋' },
  { seconds: 4.32e17,              label: 'Edad del universo (13.8 mil millones de años)', icon: '🌌' },
  { seconds: 4.32e20,              label: '1,000× la edad del universo', icon: '♾️' },
];

/** Default simulation configuration */
export const DEFAULT_CONFIG = {
  passwordLength: 8,
  useLowercase: true,
  useUppercase: false,
  useNumbers: false,
  useSymbols: false,
  computePreset: 'personal',
  simulationSpeed: 50 // ms between visual updates
};

/** Security risk levels */
export const RISK_LEVELS = [
  { max: 2,  label: 'Crítico',  color: '#ff4757', bg: 'rgba(255,71,87,0.15)',   icon: '🔴' },
  { max: 4,  label: 'Muy Débil', color: '#ff6b81', bg: 'rgba(255,107,129,0.15)', icon: '🟠' },
  { max: 5,  label: 'Débil',    color: '#ffa502', bg: 'rgba(255,165,2,0.15)',    icon: '🟡' },
  { max: 6,  label: 'Moderado', color: '#f7d047', bg: 'rgba(247,208,71,0.15)',  icon: '🟡' },
  { max: 7,  label: 'Fuerte',   color: '#7bed9f', bg: 'rgba(123,237,159,0.15)', icon: '🟢' },
  { max: 10, label: 'Muy Fuerte', color: '#00ff88', bg: 'rgba(0,255,136,0.15)', icon: '🟢' },
];

/** Bitcoin / Blockchain educational constants */
export const CRYPTO_CONSTANTS = {
  SHA256_OUTPUT_BITS: 256,
  SHA256_SPACE: '1.16 × 10⁷⁷',
  BITCOIN_PRIVATE_KEY_BITS: 256,
  BITCOIN_ADDRESS_CHARS: 34,
  ECDSA_CURVE: 'secp256k1',
  BLOCK_TIME_SECONDS: 600,
  CURRENT_HASHRATE: '500 EH/s',
  DIFFICULTY_DESCRIPTION: '~72 ceros iniciales'
};
