export interface SectionItem {
  id: string;
  name: string;
  short: string;
}

export interface Section {
  label: string;
  icon: string;
  items: SectionItem[];
}

export interface UnitMeta {
  slug: string;
  number: number;
  name: string;
  shortName: string;
  examWeight: string;
  color: string;
  description: string;
}

export interface UnitConfig extends UnitMeta {
  sections: Section[];
  /** Map from item id → React component */
  componentMap: Record<string, React.ComponentType<TopicProps> | React.ComponentType>;
  /** Item ids that count toward "learn" progress */
  learnTopicIds: string[];
}

export interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

export interface MistakeEntry {
  unit: string;
  topic: string;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  timestamp: number;
}
