import type { ComponentType } from 'react';

/**
 * Official brand colors for technologies.
 * These colors are the official/recognized brand colors for each technology.
 */
export const techBrandColors: Record<string, string> = {
    // JavaScript & TypeScript
    javascript: '#F7DF1E',
    typescript: '#3178C6',

    // Frontend
    react: '#61DAFB',
    'react-native': '#61DAFB',
    nextjs: '#000000',
    next: '#000000',
    vue: '#4FC08D',
    angular: '#DD0031',
    svelte: '#FF3E00',
    html5: '#E34F26',
    css3: '#1572B6',
    scss: '#CC6699',
    sass: '#CC6699',
    tailwind: '#06B6D4',
    bootstrap: '#7952B3',
    materialui: '#007FFF',
    semanticui: '#4183C4',

    // Backend & Frameworks
    nodejs: '#339933',
    express: '#000000',
    flask: '#000000',
    django: '#092E20',
    spring: '#6DB33F',
    laravel: '#FF2D20',
    rails: '#CC0000',
    python: '#3776AB',
    fastapi: '#009688',
    dotnet: '#512BD4',
    'c#': '#512BD4',

    // Databases
    mongodb: '#47A248',
    postgresql: '#336791',
    mysql: '#4479A1',
    sqlite: '#003B57',
    redis: '#DC382D',
    firebase: '#FFCA28',
    oracle: '#F80000',
    elasticsearch: '#005571',

    // DevOps & Cloud
    aws: '#FF9900',
    azure: '#0078D4',
    gcp: '#4285F4',
    docker: '#2496ED',
    kubernetes: '#326CE5',
    terraform: '#7B42BC',
    jenkins: '#D33833',
    git: '#F05032',
    github: '#181717',
    gitlab: '#FC6D26',
    circleci: '#343939',
    travisci: '#3A1717',

    // Mobile
    ios: '#000000',
    android: '#3DDC84',
    flutter: '#02569B',

    // Design & Tools
    figma: '#F24E1E',
    sketch: '#F7B500',
    adobe: '#FF0000',
    photoshop: '#31A8FF',
    illustrator: '#FF9A00',
    xd: '#FF61F6',
    blender: '#E87D0D',
    canva: '#00C4CC',

    // AI/ML
    tensorflow: '#FF6F00',
    pytorch: '#EE4C2C',
    keras: '#D00000',
    openai: '#412991',

    // Other
    java: '#007396',
    'c++': '#00599C',
    csharp: '#512BD4',
    go: '#00ADD8',
    rust: '#000000',
    php: '#777BB4',
    ruby: '#CC342D',
    kotlin: '#7F52FF',
    swift: '#FFAC45',
    dart: '#00B4AB',
    scala: '#C22D40',
    r: '#276DC3',
    matlab: '#0076A8',
    graphql: '#E10098',
    api: '#6CADDF',
    rest: '#6CADDF',
    json: '#292929',
    sql: '#00758F',
    nosql: '#474A5A',
    linux: '#FCC624',
    ubuntu: '#E95420',
    serverless: '#FF6B6B',
    blockchain: '#6257E1',
    web3: '#6246EA',
    cybersecurity: '#0BDA51',
    testing: '#E87D0D',
    agile: '#0052CC',
    scraping: '#FF6B6B',
};

/**
 * Mapping of technology names to Simple Icons (Si) component imports.
 * This mapping allows accurate icon/logo representation for skills/technologies.
 *
 * The iconName field in the Skill model should match one of these keys.
 * If a technology is not listed, a fallback icon will be used.
 *
 * Source: https://react-icons.github.io/react-icons/fa?query=si
 */

export const techIconMap: Record<string, ComponentType<{ size?: number; color?: string }>> = {
    // Programming Languages
    javascript: require('react-icons/fa').FaJs,
    typescript: require('react-icons/fa').FaTypescript,
    python: require('react-icons/fa').FaPython,
    java: require('react-icons/fa').FaJava,
    'c++': require('react-icons/fa').FaC,
    csharp: require('react-icons/fa').FaCsharp,
    go: require('react-icons/fa').FaGolang, // If available, else custom
    rust: require('react-icons/fa').FaRust, // Check availability
    php: require('react-icons/fa').FaPhp,
    ruby: require('react-icons/fa').FaRuby,
    kotlin: require('react-icons/fa').FaKotlin,
    swift: require('react-icons/fa').FaSwift,
    dart: require('react-icons/fa').FaDart,
    scala: require('react-icons/fa').FaScala,
    r: require('react-icons/fa').FaRProject,
    matlab: require('react-icons/fa').FaMath,

    // Frontend
    react: require('react-icons/fa').FaReact,
    'react-native': require('react-icons/fa').FaReact,
    vue: require('react-icons/fa').FaVuejs,
    angular: require('react-icons/fa').FaAngular,
    svelte: require('react-icons/fa').FaSvelte,
    html5: require('react-icons/fa').FaHtml5,
    css3: require('react-icons/fa').FaCss3Alt,
    'scss': require('react-icons/fa').FaSass,
    tailwind: require('react-icons/fa').FaWind, // Custom or FaCloud
    bootstrap: require('react-icons/fa').FaBootstrap,
    materialui: require('react-icons/fa').FaMaterialDesign,
    semanticui: require('react-icons/fa').FaSmoving, // Placeholder
    nextjs: require('react-icons/fa').FaNextjs, // Approximation

    // Backend & Frameworks
    nodejs: require('react-icons/fa').FaNode,
    express: require('react-icons/fa').FaNode,
    flask: require('react-icons/fa').FaFlask,
    django: require('react-icons/fa').FaDjango,
    spring: require('react-icons/fa').FaSeedling, // Approximation
    laravel: require('react-icons/fa').FaLaravel,
    rails: require('react-icons/fa').FaRuby,
    fastapi: require('react-icons/fa').FaBolt, // Custom/approximation
    dotnet: require('react-icons/fa').FaMicrosoft,

    // Databases
    mongodb: require('react-icons/fa').FaMongodb, // Note: react-icons/fa has FaMongodb
    postgresql: require('react-icons/fa').FaPostgresql,
    mysql: require('react-icons/fa'). FaMysql,
    sqlite: require('react-icons/fa'). FaSqlite,
    redis: require('react-icons/fa'). FaRedis,
    firebase: require('react-icons/fa').FaFire,
    oracle: require('react-icons/fa').FaDatabase, // Approximation
    elasticsearch: require('react-icons/fa').FaSearch, // Approximation

    // DevOps & Cloud
    aws: require('react-icons/fa').FaAws,
    azure: require('react-icons/fa').FaMicrosoft,
    gcp: require('react-icons/fa').FaGoogle,
    docker: require('react-icons/fa').FaDocker,
    kubernetes: require('react-icons/fa').FaKubernetes,
    terraform: require('react-icons/fa'). FaHashicorp, // Approximation
    jenkins: require('react-icons/fa').FaJenkins, // Check availability
    git: require('react-icons/fa').FaGit,
    github: require('react-icons/fa').FaGitSquare,
    gitlab: require('react-icons/fa').FaGitlab,
    circleci: require('react-icons/fa'). FaCircle, // Approximation
    travisci: require('react-icons/fa'). FaTravis, // Check

    // Mobile
    ios: require('react-icons/fa').FaApple,
    android: require('react-icons/fa').FaAndroid,
    flutter: require('react-icons/fa').FaFlutter, // Check FaFlutter availability

    // Design & Tools
    figma: require('react-icons/fa').FaFigma,
    sketch: require('react-icons/fa').FaSketch, // Check
    adobe: require('react-icons/fa').FaAdobe,
    photoshop: require('react-icons/fa').FaPhotoshop,
    illustrator: require('react-icons/fa').FaIllustrator,
    xd: require('react-icons/fa').FaAdobeXd,
    blender: require('react-icons/fa').FaBlender, // Check
    canva: require('react-icons/fa'). FaPalette, // Approximation

    // AI/ML
    tensorflow: require('react-icons/fa').FaTensorflow,
    pytorch: require('react-icons/fa').FaPyTorch, // Check
    keras: require('react-icons/fa'). FaBrain, // Approximation
    openai: require('react-icons/fa').FaOpenai, // Check availability

    // Other
    api: require('react-icons/fa').FaPlugs,
    rest: require('react-icons/fa').FaNetworkWired, // Approximation
    graphql: require('react-icons/fa').FaGraphql, // Check
    json: require('react-icons/fa'). FaBracketsCurly, // Approximation
    sql: require('react-icons/fa'). FaDatabase,
    nosql: require('react-icons/fa'). FaDatabase,
    linux: require('react-icons/fa'). FaLinux,
    ubuntu: require('react-icons/fa').FaUbuntu,
    // aws: require('react-icons/fa'). FaAws,
    serverless: require('react-icons/fa'). FaCloud, // Approximation
    blockchain: require('react-icons/fa'). FaCube, // Approximation
    web3: require('react-icons/fa'). FaEthereum, // Approximation
    cybersecurity: require('react-icons/fa').FaShieldAlt, // Approximation
    testing: require('react-icons/fa').FaVial, // Approximation
    agile: require('react-icons/fa'). FaTasks, // Approximation
    scraping: require('react-icons/fa'). FaSpider, // Approximation
};

/**
 * Get the icon component for a given technology name.
 * Falls back to a generic icon if not found.
 */
export function getTechIcon(techName: string): ComponentType<{ size?: number; color?: string }> {
    const normalized = techName.toLowerCase().trim();
    return techIconMap[normalized] || techIconMap['code'] || require('react-icons/fa').FaCode;
}

/**
 * Get the official brand color for a technology.
 * Returns the color from techBrandColors if available, otherwise a fallback gradient or accent color.
 */
export function getTechBrandColor(techName: string, fallback?: string): string | undefined {
    const normalized = techName.toLowerCase().trim();
    return techBrandColors[normalized] || fallback;
}

/**
 * Optional: Map skill categories to icons if needed
 */
export const categoryIconMap: Record<string, ComponentType<{ size?: number; color?: string }>> = {
    frontend: require('react-icons/fa').FaDesktop,
    backend: require('react-icons/fa').FaServer,
    database: require('react-icons/fa').FaDatabase,
    devops: require('react-icons/fa').FaCloud,
    mobile: require('react-icons/fa').FaMobileAlt,
    design: require('react-icons/fa').FaPalette,
    tools: require('react-icons/fa').FaWrench,
    'ai-ml': require('react-icons/fa').FaBrain,
    other: require('react-icons/fa').FaCube,
};
