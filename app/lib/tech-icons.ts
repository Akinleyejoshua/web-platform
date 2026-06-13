import type { ComponentType } from 'react';

// Import Simple Icons (brand-accurate logos) from react-icons/si
import {
    // Programming Languages
    SiJavascript,
    SiTypescript,
    SiPython,
    // SiJava,
    SiCplusplus,
    // SiCsharp,
    SiGo,
    SiRust,
    SiPhp,
    SiRuby,
    SiKotlin,
    SiSwift,
    SiDart,
    SiScala,
    SiR,
    // SiMatlab,
    // Frontend
    SiReact,
    SiVuedotjs,
    SiAngular,
    SiSvelte,
    SiHtml5,
    SiCss3,
    SiSass,
    SiTailwindcss,
    SiBootstrap,
    SiMui,
    SiNextdotjs,
    // Backend & Frameworks
    SiNodedotjs,
    SiExpress,
    SiFlask,
    SiDjango,
    SiSpring,
    SiLaravel,
    SiRubyonrails,
    SiFastapi,
    SiNestjs,
    // Databases
    SiMongodb,
    SiPostgresql,
    SiMysql,
    SiSqlite,
    SiRedis,
    SiFirebase,
    SiOracle,
    SiElasticsearch,
    // DevOps & Cloud
    SiAmazonwebservices,
    // SiMicrosoftazure,
    SiGooglecloud,
    SiDocker,
    SiKubernetes,
    SiTerraform,
    SiJenkins,
    SiGit,
    SiGithub,
    SiGitlab,
    SiCircleci,
    SiTravisci,
    // Mobile
    SiApple,
    SiAndroid,
    SiFlutter,
    // Design & Tools
    SiFigma,
    SiSketch,
    SiAdobe,
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiAdobexd,
    SiBlender,
    SiCanva,
    // AI/ML
    SiTensorflow,
    SiPytorch,
    SiKeras,
    SiOpenai,
    SiScikitlearn,
    SiPandas,
    SiNumpy,
    // Other
    SiGraphql,
    // SiWeb3,
    SiLinux,
    SiUbuntu,
    SiSolidity
    
} from 'react-icons/si';

// Import Font Awesome for fallbacks and techs without Simple Icons
import {
    FaCode,
    FaServer,
    FaDatabase,
    FaCloud,
    FaMobileAlt,
    FaPalette,
    FaWrench,
    FaBrain,
    FaCube,
    FaDesktop,
    FaNetworkWired,
    FaPlug,
    FaShieldAlt,
    FaVial,
    FaTasks,
    FaSpider,
    FaSquare,
    FaMicrosoft,
    // FaBracketsCurly,
    
} from 'react-icons/fa';

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
    nestjs: '#E0234E',
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
    'scikit-learn': '#F8981D',
    scikitlearn: '#F8981D',
    pandas: '#150458',
    numpy: '#013243',

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
    solidity: '#363636',
};

/**
 * Mapping of technology names to icon components.
 * Uses Simple Icons (Si) for brand-accurate logos where available, falls back to Font Awesome (Fa).
 *
 * The iconName field in the Skill model should match one of these keys.
 * If a technology is not listed, a generic FaCode icon will be used.
 */
export const techIconMap: Record<string, ComponentType<{ size?: number; color?: string }>> = {
    // Programming Languages
    javascript: SiJavascript,
    typescript: SiTypescript,
    python: SiPython,
    // java: SiJava,
    'c++': SiCplusplus,
    // csharp: SiCsharp,
    go: SiGo,
    rust: SiRust,
    php: SiPhp,
    ruby: SiRuby,
    kotlin: SiKotlin,
    swift: SiSwift,
    dart: SiDart,
    scala: SiScala,
    r: SiR,
    // matlab: SiMatlab,

    // Frontend
    react: SiReact,
    'react-native': SiReact,
    vue: SiVuedotjs,
    angular: SiAngular,
    svelte: SiSvelte,
    html5: SiHtml5,
    css3: SiCss3,
    scss: SiSass,
    sass: SiSass,
    tailwind: SiTailwindcss,
    bootstrap: SiBootstrap,
    materialui: SiMui,
    semanticui: FaSquare, // Placeholder (no Simple Icon)
    nextjs: SiNextdotjs,
    next: SiNextdotjs,

    // Backend & Frameworks
    nodejs: SiNodedotjs,
    express: SiExpress,
    flask: SiFlask,
    django: SiDjango,
    spring: SiSpring,
    laravel: SiLaravel,
    rails: SiRubyonrails,
    fastapi: SiFastapi,
    nestjs: SiNestjs,
    dotnet: FaMicrosoft, // No SiDotnet, use Microsoft as proxy
    'c#': FaMicrosoft,

    // Databases
    mongodb: SiMongodb,
    postgresql: SiPostgresql,
    mysql: SiMysql,
    sqlite: SiSqlite,
    redis: SiRedis,
    firebase: SiFirebase,
    oracle: SiOracle,
    elasticsearch: SiElasticsearch,

    // DevOps & Cloud
    aws: SiAmazonwebservices,
    // azure: SiMicrosoftazure,
    gcp: SiGooglecloud,
    docker: SiDocker,
    kubernetes: SiKubernetes,
    terraform: SiTerraform,
    jenkins: SiJenkins,
    git: SiGit,
    github: SiGithub,
    gitlab: SiGitlab,
    circleci: SiCircleci,
    travisci: SiTravisci,

    // Mobile
    ios: SiApple,
    android: SiAndroid,
    flutter: SiFlutter,

    // Design & Tools
    figma: SiFigma,
    sketch: SiSketch,
    adobe: SiAdobe,
    photoshop: SiAdobephotoshop,
    illustrator: SiAdobeillustrator,
    xd: SiAdobexd,
    blender: SiBlender,
    canva: SiCanva,

    // AI/ML
    tensorflow: SiTensorflow,
    pytorch: SiPytorch,
    keras: SiKeras,
    openai: SiOpenai,
    'scikit-learn': SiScikitlearn,
    scikitlearn: SiScikitlearn,
    pandas: SiPandas,
    numpy: SiNumpy,

    // Other
    api: FaPlug,
    rest: FaNetworkWired,
    graphql: SiGraphql,
    // json: FaBracketsCurly,
    sql: FaDatabase,
    nosql: FaDatabase,
    linux: SiLinux,
    ubuntu: SiUbuntu,
    serverless: FaCloud,
    blockchain: FaCube,
    solidity: SiSolidity,
    // web3: SiWeb3,
    cybersecurity: FaShieldAlt,
    testing: FaVial,
    agile: FaTasks,
    scraping: FaSpider,
    // fallback generic
    code: FaCode,
};

/**
 * Get the icon component for a given technology name.
 * Normalizes the name and returns the mapped icon, or FaCode if not found.
 */
export function getTechIcon(techName: string): ComponentType<{ size?: number; color?: string }> {
    const normalized = techName.toLowerCase().trim();
    return techIconMap[normalized] || FaCode;
}

/**
 * Get the official brand color for a technology.
 * Returns the color from techBrandColors if available, otherwise the fallback.
 */
export function getTechBrandColor(techName: string, fallback?: string): string | undefined {
    const normalized = techName.toLowerCase().trim();
    return techBrandColors[normalized] || fallback;
}

/**
 * Category icons (for admin or other UI)
 */
export const categoryIconMap: Record<string, ComponentType<{ size?: number; color?: string }>> = {
    frontend: FaDesktop,
    backend: FaServer,
    database: FaDatabase,
    devops: FaCloud,
    mobile: FaMobileAlt,
    design: FaPalette,
    tools: FaWrench,
    'ai-ml': FaBrain,
    other: FaCube,
};
