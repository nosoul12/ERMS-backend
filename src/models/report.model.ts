import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  reportId: string;
  slug: string;
  title?: string;
  subtitle?: string;
  publisher?: string;
  industry?: string;
  segment?: string;
  timeframe?: {
    baseYear?: number;
    forecastStart?: number;
    forecastEnd?: number;
    studyPeriod?: string;
  };
  marketOverview?: {
    marketSizeBaseYear?: string;
    marketSizeForecastYear?: string;
    cagr?: string;
    summary?: string;
  };
  reportScope?: string;
  segmentation?: Record<string, any>;
  marketDynamics?: {
    drivers?: string[];
    restraints?: string[];
    opportunities?: string[];
    challenges?: string[];
  };
  regionalAnalysis?: {
    region?: string;
    description?: string;
    sharePercent?: string;
    cagr?: string;
  }[];
  segmentAnalysis?: {
    segmentName?: string;
    categories?: {
      category?: string;
      sharePercent?: string;
      cagr?: string;
      commentary?: string;
    }[];
  }[];
  competitiveLandscape?: {
    marketConcentration?: string;
    topPlayers?: string[];
    recentDevelopments?: {
      company?: string;
      event?: string;
      date?: string;
      source?: string;
    }[];
    strategicInitiatives?: string[];
  };
  researchMethodology?: {
    primaryResearch?: string;
    secondaryResearch?: string;
    marketEstimation?: string;
    forecastingApproach?: string;
    validation?: string;
    assumptions?: string;
  };
  keyInsights?: string[];
  keyQuestionsAnswered?: string[];
  toc?: {
    section?: string;
    subsections?: string[];
  }[];
  metadata?: {
    sourceFile?: string;
    retrievedOn?: string;
    sourceUrl?: string;
    lastUpdated?: string;
    language?: string;
  };
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    title: String,
    subtitle: String,
    publisher: String,
    industry: String,
    segment: String,
    timeframe: Object,
    marketOverview: Object,
    reportScope: String,
    segmentation: Schema.Types.Mixed,
    marketDynamics: Object,
    regionalAnalysis: [Object],
    segmentAnalysis: [Object],
    competitiveLandscape: Object,
    researchMethodology: Object,
    keyInsights: [String],
    keyQuestionsAnswered: [String],
    toc: [Object],
    metadata: Object,
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema, "reports");
