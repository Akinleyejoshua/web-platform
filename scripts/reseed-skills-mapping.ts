/**
 * reseed-skills-mapping.ts
 * 
 * This script maps existing tags on projects and products to skills in the database.
 * If a skill doesn't exist, it creates one with the proper iconName for logo display.
 * Then updates the item's technologies array to use skill names that match existing skills.
 * 
 * Usage: MONGODB_URI='...' npx tsx scripts/reseed-skills-mapping.ts
 */

import mongoose from 'mongoose';
import connectDB from '../app/lib/db';
import Project from '../app/lib/models/project';
import ProductProject from '../app/lib/models/productProject';
import Skill from '../app/lib/models/skill';
import { techIconMap, techBrandColors } from '../app/lib/tech-icons';

// Common tag name variations to canonical skill names
const TAG_TO_SKILL_MAP: Record<string, { name: string; iconName: string; category: string }> = {
    // Frontend
    'react': { name: 'React', iconName: 'react', category: 'frontend' },
    'reactjs': { name: 'React', iconName: 'react', category: 'frontend' },
    'react.js': { name: 'React', iconName: 'react', category: 'frontend' },
    'next': { name: 'Next.js', iconName: 'nextjs', category: 'frontend' },

    'next.js': { name: 'Next.js', iconName: 'nextjs', category: 'frontend' },
    'vue': { name: 'Vue.js', iconName: 'vue', category: 'frontend' },
    'vuejs': { name: 'Vue.js', iconName: 'vue', category: 'frontend' },
    'vue.js': { name: 'Vue.js', iconName: 'vue', category: 'frontend' },
    'angular': { name: 'Angular', iconName: 'angular', category: 'frontend' },
    'svelte': { name: 'Svelte', iconName: 'svelte', category: 'frontend' },
    'html': { name: 'HTML5', iconName: 'html5', category: 'frontend' },
    'html5': { name: 'HTML5', iconName: 'html5', category: 'frontend' },
    'css': { name: 'CSS3', iconName: 'css3', category: 'frontend' },
    'css3': { name: 'CSS3', iconName: 'css3', category: 'frontend' },
    'scss': { name: 'Sass', iconName: 'sass', category: 'frontend' },
    'sass': { name: 'Sass', iconName: 'sass', category: 'frontend' },
    'tailwind': { name: 'Tailwind CSS', iconName: 'tailwind', category: 'frontend' },
    'tailwindcss': { name: 'Tailwind CSS', iconName: 'tailwind', category: 'frontend' },
    'tailwind css': { name: 'Tailwind CSS', iconName: 'tailwind', category: 'frontend' },
    'bootstrap': { name: 'Bootstrap', iconName: 'bootstrap', category: 'frontend' },
    'material ui': { name: 'Material UI', iconName: 'materialui', category: 'frontend' },
    'mui': { name: 'Material UI', iconName: 'materialui', category: 'frontend' },
    'materialui': { name: 'Material UI', iconName: 'materialui', category: 'frontend' },
    'chakra': { name: 'Chakra UI', iconName: 'chakraui', category: 'frontend' },
    'chakra ui': { name: 'Chakra UI', iconName: 'chakraui', category: 'frontend' },
    'chakraui': { name: 'Chakra UI', iconName: 'chakraui', category: 'frontend' },
    'radix': { name: 'Radix UI', iconName: 'radixui', category: 'frontend' },
    'radix ui': { name: 'Radix UI', iconName: 'radixui', category: 'frontend' },
    'radixui': { name: 'Radix UI', iconName: 'radixui', category: 'frontend' },
    'shadcn': { name: 'shadcn/ui', iconName: 'radixui', category: 'frontend' },
    'shadcn/ui': { name: 'shadcn/ui', iconName: 'radixui', category: 'frontend' },
    
    // Backend
    'node': { name: 'Node.js', iconName: 'nodejs', category: 'backend' },
    'nodejs': { name: 'Node.js', iconName: 'nodejs', category: 'backend' },
    'node.js': { name: 'Node.js', iconName: 'nodejs', category: 'backend' },
    'express': { name: 'Express.js', iconName: 'express', category: 'backend' },
    'express.js': { name: 'Express.js', iconName: 'express', category: 'backend' },
    'nestjs': { name: 'NestJS', iconName: 'nestjs', category: 'backend' },
    'nest': { name: 'NestJS', iconName: 'nestjs', category: 'backend' },
    'fastify': { name: 'Fastify', iconName: 'fastapi', category: 'backend' },
    'flask': { name: 'Flask', iconName: 'flask', category: 'backend' },
    'django': { name: 'Django', iconName: 'django', category: 'backend' },
    'laravel': { name: 'Laravel', iconName: 'laravel', category: 'backend' },
    'rails': { name: 'Ruby on Rails', iconName: 'rails', category: 'backend' },
    'ruby on rails': { name: 'Ruby on Rails', iconName: 'rails', category: 'backend' },
    'spring': { name: 'Spring Boot', iconName: 'spring', category: 'backend' },
    'spring boot': { name: 'Spring Boot', iconName: 'spring', category: 'backend' },
    'asp.net': { name: '.NET', iconName: 'express', category: 'backend' },
    'dotnet': { name: '.NET', iconName: 'express', category: 'backend' },
    
    // Programming Languages
    'javascript': { name: 'JavaScript', iconName: 'javascript', category: 'frontend' },
    'js': { name: 'JavaScript', iconName: 'javascript', category: 'frontend' },
    'typescript': { name: 'TypeScript', iconName: 'typescript', category: 'frontend' },
    'ts': { name: 'TypeScript', iconName: 'typescript', category: 'frontend' },
    'python': { name: 'Python', iconName: 'python', category: 'backend' },
    'py': { name: 'Python', iconName: 'python', category: 'backend' },
    'java': { name: 'Java', iconName: 'java', category: 'backend' },
    'kotlin': { name: 'Kotlin', iconName: 'kotlin', category: 'mobile' },
    'swift': { name: 'Swift', iconName: 'swift', category: 'mobile' },
    'go': { name: 'Go', iconName: 'go', category: 'backend' },
    'golang': { name: 'Go', iconName: 'go', category: 'backend' },
    'rust': { name: 'Rust', iconName: 'rust', category: 'backend' },
    'php': { name: 'PHP', iconName: 'php', category: 'backend' },
    'ruby': { name: 'Ruby', iconName: 'ruby', category: 'backend' },
    'c++': { name: 'C++', iconName: 'c++', category: 'backend' },
    'cpp': { name: 'C++', iconName: 'c++', category: 'backend' },
    'csharp': { name: 'C#', iconName: 'csharp', category: 'backend' },
    'c#': { name: 'C#', iconName: 'csharp', category: 'backend' },
    'dart': { name: 'Dart', iconName: 'dart', category: 'mobile' },
    
    // Databases
    'mongodb': { name: 'MongoDB', iconName: 'mongodb', category: 'database' },
    'postgres': { name: 'PostgreSQL', iconName: 'postgresql', category: 'database' },
    'postgresql': { name: 'PostgreSQL', iconName: 'postgresql', category: 'database' },
    'mysql': { name: 'MySQL', iconName: 'mysql', category: 'database' },
    'sqlite': { name: 'SQLite', iconName: 'sqlite', category: 'database' },
    'sql': { name: 'SQL', iconName: 'sql', category: 'database' },
    'redis': { name: 'Redis', iconName: 'redis', category: 'database' },
    'firebase': { name: 'Firebase', iconName: 'firebase', category: 'database' },
    'supabase': { name: 'Supabase', iconName: 'supabase', category: 'database' },
    'dynamo': { name: 'AWS DynamoDB', iconName: 'aws', category: 'database' },
    'dynamodb': { name: 'AWS DynamoDB', iconName: 'aws', category: 'database' },
    'neo4j': { name: 'Neo4j', iconName: 'neo4j', category: 'database' },
    'elasticsearch': { name: 'Elasticsearch', iconName: 'elasticsearch', category: 'database' },
    
    // DevOps & Cloud
    'docker': { name: 'Docker', iconName: 'docker', category: 'devops' },
    'kubernetes': { name: 'Kubernetes', iconName: 'kubernetes', category: 'devops' },
    'k8s': { name: 'Kubernetes', iconName: 'kubernetes', category: 'devops' },
    'aws': { name: 'AWS', iconName: 'aws', category: 'devops' },
    'amazon': { name: 'AWS', iconName: 'aws', category: 'devops' },
    'amazon web services': { name: 'AWS', iconName: 'aws', category: 'devops' },
    'azure': { name: 'Azure', iconName: 'gcp', category: 'devops' },
    'gcp': { name: 'Google Cloud', iconName: 'googlecloud', category: 'devops' },
    'google cloud': { name: 'Google Cloud', iconName: 'googlecloud', category: 'devops' },
    'google cloud platform': { name: 'Google Cloud', iconName: 'googlecloud', category: 'devops' },
    'vercel': { name: 'Vercel', iconName: 'vercel', category: 'devops' },
    'netlify': { name: 'Netlify', iconName: 'netlify', category: 'devops' },
    'heroku': { name: 'Heroku', iconName: 'heroku', category: 'devops' },
    'digitalocean': { name: 'DigitalOcean', iconName: 'digitalocean', category: 'devops' },
    'terraform': { name: 'Terraform', iconName: 'terraform', category: 'devops' },
    'jenkins': { name: 'Jenkins', iconName: 'jenkins', category: 'devops' },
    'ci/cd': { name: 'CI/CD', iconName: 'circleci', category: 'devops' },
    'circleci': { name: 'CircleCI', iconName: 'circleci', category: 'devops' },
    'github actions': { name: 'GitHub Actions', iconName: 'github', category: 'devops' },
    'gitlab ci': { name: 'GitLab CI', iconName: 'gitlab', category: 'devops' },
    
    // Mobile
    'react native': { name: 'React Native', iconName: 'react', category: 'mobile' },
    'reactnative': { name: 'React Native', iconName: 'react', category: 'mobile' },
    'rn': { name: 'React Native', iconName: 'react', category: 'mobile' },
    'flutter': { name: 'Flutter', iconName: 'flutter', category: 'mobile' },
    'ios': { name: 'iOS', iconName: 'apple', category: 'mobile' },
    'android': { name: 'Android', iconName: 'android', category: 'mobile' },
    'expo': { name: 'Expo', iconName: 'react', category: 'mobile' },
    
    // AI/ML
    'tensorflow': { name: 'TensorFlow', iconName: 'tensorflow', category: 'ai-ml' },
    'tf': { name: 'TensorFlow', iconName: 'tensorflow', category: 'ai-ml' },
    'pytorch': { name: 'PyTorch', iconName: 'pytorch', category: 'ai-ml' },
    'torch': { name: 'PyTorch', iconName: 'pytorch', category: 'ai-ml' },
    'machine learning': { name: 'Machine Learning', iconName: 'scikitlearn', category: 'ai-ml' },
    'ml': { name: 'Machine Learning', iconName: 'scikitlearn', category: 'ai-ml' },
    'deep learning': { name: 'Deep Learning', iconName: 'tensorflow', category: 'ai-ml' },
    'dl': { name: 'Deep Learning', iconName: 'tensorflow', category: 'ai-ml' },
    'nlp': { name: 'NLP', iconName: 'pytorch', category: 'ai-ml' },
    'natural language processing': { name: 'NLP', iconName: 'pytorch', category: 'ai-ml' },
    'computer vision': { name: 'Computer Vision', iconName: 'opencv', category: 'ai-ml' },
    'opencv': { name: 'OpenCV', iconName: 'opencv', category: 'ai-ml' },
    'scikit learn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'scikit-learn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'sklearn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'pandas': { name: 'Pandas', iconName: 'pandas', category: 'ai-ml' },
    'numpy': { name: 'NumPy', iconName: 'numpy', category: 'ai-ml' },
    'keras': { name: 'Keras', iconName: 'keras', category: 'ai-ml' },
    'open ai': { name: 'OpenAI', iconName: 'openai', category: 'ai-ml' },
    'openai': { name: 'OpenAI', iconName: 'openai', category: 'ai-ml' },
    'gpt': { name: 'GPT', iconName: 'openai', category: 'ai-ml' },
    'langchain': { name: 'LangChain', iconName: 'langchain', category: 'ai-ml' },
    'huggingface': { name: 'Hugging Face', iconName: 'huggingface', category: 'ai-ml' },
    'transformer': { name: 'Transformers', iconName: 'huggingface', category: 'ai-ml' },
    
    // Design & Tools
    'figma': { name: 'Figma', iconName: 'figma', category: 'design' },
    'sketch': { name: 'Sketch', iconName: 'sketch', category: 'design' },
    'adobe xd': { name: 'Adobe XD', iconName: 'adobexd', category: 'design' },
    'xd': { name: 'Adobe XD', iconName: 'adobexd', category: 'design' },
    'photoshop': { name: 'Photoshop', iconName: 'adobephotoshop', category: 'design' },
    'illustrator': { name: 'Illustrator', iconName: 'adobeillustrator', category: 'design' },
    'blender': { name: 'Blender', iconName: 'blender', category: 'design' },
    'canva': { name: 'Canva', iconName: 'canva', category: 'design' },
    'after effects': { name: 'After Effects', iconName: 'adobe', category: 'design' },
    'premiere pro': { name: 'Premiere Pro', iconName: 'adobe', category: 'design' },
    
    // Other
    'git': { name: 'Git', iconName: 'git', category: 'tools' },
    'github': { name: 'GitHub', iconName: 'github', category: 'tools' },
    'git Hub': { name: 'GitHub', iconName: 'github', category: 'tools' },
    'graphql': { name: 'GraphQL', iconName: 'graphql', category: 'backend' },
    'rest': { name: 'REST API', iconName: 'rest', category: 'backend' },
    'rest api': { name: 'REST API', iconName: 'rest', category: 'backend' },
    'api': { name: 'API', iconName: 'api', category: 'backend' },
    'websocket': { name: 'WebSocket', iconName: 'websocket', category: 'backend' },
    'websockets': { name: 'WebSocket', iconName: 'websocket', category: 'backend' },
    'socket.io': { name: 'Socket.io', iconName: 'socketio', category: 'backend' },
    'socketio': { name: 'Socket.io', iconName: 'socketio', category: 'backend' },
    'redis': { name: 'Redis', iconName: 'redis', category: 'database' },
    'linux': { name: 'Linux', iconName: 'linux', category: 'tools' },
    'unix': { name: 'Linux', iconName: 'linux', category: 'tools' },
    'ubuntu': { name: 'Ubuntu', iconName: 'ubuntu', category: 'tools' },
    'bash': { name: 'Bash', iconName: 'bash', category: 'tools' },
    'shell': { name: 'Shell', iconName: 'bash', category: 'tools' },
    'typescript': { name: 'TypeScript', iconName: 'typescript', category: 'frontend' },
    'prisma': { name: 'Prisma', iconName: 'prisma', category: 'backend' },
    'typeorm': { name: 'TypeORM', iconName: 'typeorm', category: 'backend' },
    'mongoose': { name: 'Mongoose', iconName: 'mongoose', category: 'backend' },
    'sequelize': { name: 'Sequelize', iconName: 'mysql', category: 'backend' },
    'typegraphql': { name: 'TypeGraphQL', iconName: 'graphql', category: 'backend' },
    'apollo': { name: 'Apollo GraphQL', iconName: 'apollo', category: 'backend' },
    'ws': { name: 'WebSocket', iconName: 'websocket', category: 'backend' },
    'webrtc': { name: 'WebRTC', iconName: 'webrtc', category: 'backend' },
    'web sockets': { name: 'WebSocket', iconName: 'websocket', category: 'backend' },
    'rest api': { name: 'REST API', iconName: 'rest', category: 'backend' },
    'microservices': { name: 'Microservices', iconName: 'microservices', category: 'backend' },
    'microservice': { name: 'Microservices', iconName: 'microservices', category: 'backend' },
    'serverless': { name: 'Serverless', iconName: 'serverless', category: 'backend' },
    'lambda': { name: 'AWS Lambda', iconName: 'aws', category: 'backend' },
    's3': { name: 'AWS S3', iconName: 'aws', category: 'backend' },
    'ec2': { name: 'AWS EC2', iconName: 'aws', category: 'backend' },
    'rds': { name: 'AWS RDS', iconName: 'aws', category: 'backend' },
    'cloudfront': { name: 'AWS CloudFront', iconName: 'aws', category: 'backend' },
    'route53': { name: 'AWS Route53', iconName: 'aws', category: 'backend' },
    'iam': { name: 'AWS IAM', iconName: 'aws', category: 'backend' },
    'sns': { name: 'AWS SNS', iconName: 'aws', category: 'backend' },
    'sqs': { name: 'AWS SQS', iconName: 'aws', category: 'backend' },
    'ses': { name: 'AWS SES', iconName: 'aws', category: 'backend' },
    'cloudwatch': { name: 'AWS CloudWatch', iconName: 'aws', category: 'backend' },
    'cognito': { name: 'AWS Cognito', iconName: 'aws', category: 'backend' },
    'vpc': { name: 'AWS VPC', iconName: 'aws', category: 'backend' },
    'ecs': { name: 'AWS ECS', iconName: 'aws', category: 'backend' },
    'eks': { name: 'AWS EKS', iconName: 'aws', category: 'backend' },
    'lambda': { name: 'AWS Lambda', iconName: 'aws', category: 'backend' },
    'sagemaker': { name: 'AWS SageMaker', iconName: 'aws', category: 'backend' },
    'rekognition': { name: 'AWS Rekognition', iconName: 'aws', category: 'backend' },
    ' Polly': { name: 'AWS Polly', iconName: 'aws', category: 'backend' },
    'transcribe': { name: 'AWS Transcribe', iconName: 'aws', category: 'backend' },
    'translate': { name: 'AWS Translate', iconName: 'aws', category: 'backend' },
    'comprehend': { name: 'AWS Comprehend', iconName: 'aws', category: 'backend' },
    'lex': { name: 'AWS Lex', iconName: 'aws', category: 'backend' },
    'connect': { name: 'AWS Connect', iconName: 'aws', category: 'backend' },
    'pinpoint': { name: 'AWS Pinpoint', iconName: 'aws', category: 'backend' },
    'amplify': { name: 'AWS Amplify', iconName: 'aws', category: 'backend' },
    'appsync': { name: 'AWS AppSync', iconName: 'aws', category: 'backend' },
    'step functions': { name: 'AWS Step Functions', iconName: 'aws', category: 'backend' },
    'state machine': { name: 'AWS Step Functions', iconName: 'aws', category: 'backend' },
    'swf': { name: 'AWS SWF', iconName: 'aws', category: 'backend' },
    'codedeploy': { name: 'AWS CodeDeploy', iconName: 'aws', category: 'backend' },
    'codebuild': { name: 'AWS CodeBuild', iconName: 'aws', category: 'backend' },
    'codepipeline': { name: 'AWS CodePipeline', iconName: 'aws', category: 'backend' },
    'codestar': { name: 'AWS CodeStar', iconName: 'aws', category: 'backend' },
    'cloudformation': { name: 'AWS CloudFormation', iconName: 'aws', category: 'backend' },
    'opsworks': { name: 'AWS OpsWorks', iconName: 'aws', category: 'backend' },
    'elastic beanstalk': { name: 'AWS Elastic Beanstalk', iconName: 'aws', category: 'backend' },
    'elast  icsearch': { name: 'Elasticsearch', iconName: 'elasticsearch', category: 'backend' },
    'kinesis': { name: 'AWS Kinesis', iconName: 'aws', category: 'backend' },
    'firehose': { name: 'AWS Kinesis Firehose', iconName: 'aws', category: 'backend' },
    'analytics': { name: 'AWS Analytics', iconName: 'aws', category: 'backend' },
    'athena': { name: 'AWS Athena', iconName: 'aws', category: 'backend' },
    'emr': { name: 'AWS EMR', iconName: 'aws', category: 'backend' },
    'glue': { name: 'AWS Glue', iconName: 'aws', category: 'backend' },
    'data pipeline': { name: 'AWS Data Pipeline', iconName: 'aws', category: 'backend' },
    'quick sight': { name: 'AWS QuickSight', iconName: 'aws', category: 'backend' },
    'quicksight': { name: 'AWS QuickSight', iconName: 'aws', category: 'backend' },
    'machine learning': { name: 'Machine Learning', iconName: 'machine learning', category: 'ai-ml' },
    'ml': { name: 'Machine Learning', iconName: 'machine learning', category: 'ai-ml' },
    'deep learning': { name: 'Deep Learning', iconName: 'deep learning', category: 'ai-ml' },
    'dl': { name: 'Deep Learning', iconName: 'deep learning', category: 'ai-ml' },
    'nlp': { name: 'NLP', iconName: 'nlp', category: 'ai-ml' },
    'natural language processing': { name: 'Natural Language Processing', iconName: 'nlp', category: 'ai-ml' },
    'computer vision': { name: 'Computer Vision', iconName: 'computer vision', category: 'ai-ml' },
    'opencv': { name: 'OpenCV', iconName: 'opencv', category: 'ai-ml' },
    'scikit learn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'scikit-learn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'sklearn': { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' },
    'pandas': { name: 'Pandas', iconName: 'pandas', category: 'ai-ml' },
    'numpy': { name: 'NumPy', iconName: 'numpy', category: 'ai-ml' },
    'keras': { name: 'Keras', iconName: 'keras', category: 'ai-ml' },
    'open ai': { name: 'OpenAI', iconName: 'openai', category: 'ai-ml' },
    'openai': { name: 'OpenAI', iconName: 'openai', category: 'ai-ml' },
    'gpt': { name: 'GPT', iconName: 'gpt', category: 'ai-ml' },
    'langchain': { name: 'LangChain', iconName: 'langchain', category: 'ai-ml' },
    'huggingface': { name: 'Hugging Face', iconName: 'huggingface', category: 'ai-ml' },
    'transformer': { name: 'Transformers', iconName: 'transformer', category: 'ai-ml' },
};
 
// Fix typos - correct the key mappings
TAG_TO_SKILL_MAP['web sockets'] = TAG_TO_SKILL_MAP['websocket'];
TAG_TO_SKILL_MAP['microservices'] = { name: 'Microservices', iconName: 'microservices', category: 'backend' };
TAG_TO_SKILL_MAP['microservice'] = TAG_TO_SKILL_MAP['microservices'];
TAG_TO_SKILL_MAP['serverless'] = { name: 'Serverless', iconName: 'serverless', category: 'backend' };
TAG_TO_SKILL_MAP['lambda'] = { name: 'AWS Lambda', iconName: 'aws', category: 'backend' };
TAG_TO_SKILL_MAP['nlp'] = { name: 'NLP', iconName: 'nlp', category: 'ai-ml' };
TAG_TO_SKILL_MAP['natural language processing'] = { name: 'Natural Language Processing', iconName: 'nlp', category: 'ai-ml' };
TAG_TO_SKILL_MAP['computer vision'] = { name: 'Computer Vision', iconName: 'computer vision', category: 'ai-ml' };
TAG_TO_SKILL_MAP['scikit learn'] = { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' };
TAG_TO_SKILL_MAP['scikit-learn'] = { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' };
TAG_TO_SKILL_MAP['sklearn'] = { name: 'Scikit-learn', iconName: 'scikitlearn', category: 'ai-ml' };
TAG_TO_SKILL_MAP['open ai'] = { name: 'OpenAI', iconName: 'openai', category: 'ai-ml' };
TAG_TO_SKILL_MAP['langchain'] = { name: 'LangChain', iconName: 'langchain', category: 'ai-ml' };
TAG_TO_SKILL_MAP['huggingface'] = { name: 'Hugging Face', iconName: 'huggingface', category: 'ai-ml' };
TAG_TO_SKILL_MAP['transformer'] = { name: 'Transformers', iconName: 'transformer', category: 'ai-ml' };

// Missing from techIconMap but added here for completeness
const EXTRA_ICONS: Record<string, string> = {
    'microservices': 'microservices',
    'serverless': 'serverless',
    'machine learning': 'machine learning',
    'deep learning': 'deep learning',
    'nlp': 'nlp',
    'natural language processing': 'natural language processing',
    'computer vision': 'computer vision',
    'langchain': 'langchain',
    'huggingface': 'huggingface',
    'transformer': 'transformer',
    'webrtc': 'webrtc',
    'socketio': 'socketio',
    'websocket': 'websocket',
    'apollo': 'apollo',
};

// Add extra icons to techIconMap (dynamically)
for (const [key, iconName] of Object.entries(EXTRA_ICONS)) {
    if (!techIconMap[key]) {
        // These don't have direct Simple Icons so use FaIcons as fallback
        techIconMap[key] = techIconMap['code'] || (null as any);
    }
    // Add brand color if not exists
    if (!techBrandColors[key]) {
        techBrandColors[key] = '#6b7280';
    }
}

interface SkillInfo {
    name: string;
    iconName: string;
    category: string;
}

async function findOrCreateSkill(tag: string): Promise<SkillInfo | null> {
    const normalizedTag = tag.toLowerCase().trim();
    const mapping = TAG_TO_SKILL_MAP[normalizedTag];
    
    if (!mapping) {
        console.log(`  ⚠️  No mapping found for tag: "${tag}"`);
        return null;
    }
    
    // Try to find existing skill
    let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${mapping.name}$`, 'i') } });
    
    if (!skill) {
        // Create the skill if it doesn't exist
        skill = await Skill.create({
            name: mapping.name,
            iconName: mapping.iconName,
            category: mapping.category as any,
            color: techBrandColors[mapping.iconName] || techBrandColors[normalizedTag] || undefined,
            proficiency: 80,
            order: 0,
            isVisible: true,
        });
        console.log(`  ✓ Created skill: ${mapping.name} (icon: ${mapping.iconName})`);
    }
    
    return {
        name: skill.name,
        iconName: skill.iconName,
        category: skill.category,
    };
}

async function processItem<T extends { technologies?: string[]; title: string; _id?: any }>(
    item: T,
    itemType: 'project' | 'product',
    updateFn: (id: any, technologies: string[]) => Promise<void>
) {
    if (!item.technologies || item.technologies.length === 0) {
        return { updated: false, reason: 'no technologies' };
    }
    
    const mappedTechs: string[] = [];
    const errors: string[] = [];
    
    for (const tag of item.technologies) {
        const skillInfo = await findOrCreateSkill(tag);
        if (skillInfo) {
            mappedTechs.push(skillInfo.name);
        } else {
            errors.push(tag);
            // Keep original tag if no mapping found
            mappedTechs.push(tag);
        }
    }
    
    if (errors.length > 0) {
        console.log(`  ⚠️  ${itemType} "${item.title}": ${errors.length} tags without mapping: ${errors.join(', ')}`);
    }
    
    // Update the item with mapped technology names
    if (item._id) {
        await updateFn(item._id, mappedTechs);
    }
    
    return { updated: true, count: mappedTechs.length };
}

async function run() {
    try {
        await connectDB();

        console.log('🔄 Starting skills mapping for projects and products...\n');

        // Process Projects
        console.log('📋 Processing Projects...');
        const projects = await Project.find({ technologies: { $exists: true, $ne: [] } });
        let projectCount = 0;
        
        for (const project of projects) {
            const result = await processItem(
                project,
                'project',
                async (id, techs) => {
                    await Project.findByIdAndUpdate(id, { technologies: techs });
                }
            );
            
            if (result.updated) {
                projectCount++;
                console.log(`  ✓ ${project.title}: ${result.count} skills mapped`);
            }
        }
        console.log(`  Total: ${projectCount} projects updated\n`);

        // Process Products
        console.log('📦 Processing Products...');
        const products = await ProductProject.find({ technologies: { $exists: true, $ne: [] } });
        let productCount = 0;
        
        for (const product of products) {
            const result = await processItem(
                product,
                'product',
                async (id, techs) => {
                    await ProductProject.findByIdAndUpdate(id, { technologies: techs });
                }
            );
            
            if (result.updated) {
                productCount++;
                console.log(`  ✓ ${product.title}: ${result.count} skills mapped`);
            }
        }
        console.log(`  Total: ${productCount} products updated\n`);

        // Summary
        const totalSkills = await Skill.countDocuments();
        console.log('✅ Skills mapping complete!');
        console.log(`   Projects updated: ${projectCount}`);
        console.log(`   Products updated: ${productCount}`);
        console.log(`   Total skills in DB: ${totalSkills}`);
        
    } catch (error) {
        console.error('❌ Error during skills mapping:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

run();
