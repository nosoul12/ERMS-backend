import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  reportId: string;
  slug: string;
  title: string;
  subtitle?: string;
  publisher: string;
  industry: string;
  segment: string;
  timeframe: {
    baseYear: number;
    forecastStart: number;
    forecastEnd: number;
    studyPeriod: string;
  };
  marketOverview: {
    marketSizeBaseYear: string;
    marketSizeForecastYear: string;
    cagr: string;
    summary: string;
  };
  reportScope: string;
  segmentation: {
    byOffering: string[];
    byDeployment: string[];
    byEndUserIndustry: string[];
    byRegion: string[];
  };
  marketDynamics: {
    drivers: string[];
    restraints: string[];
    opportunities: string[];
    challenges: string[];
  };
  regionalAnalysis: {
    region: string;
    description: string;
    sharePercent: string;
    cagr: string;
  }[];
  competitiveLandscape: {
    marketConcentration: string;
    topPlayers: string[];
    recentDevelopments: {
      company: string;
      event: string;
      date: string;
    }[];
    strategicInitiatives: string[];
  };
  researchMethodology: {
    primaryResearch: string;
    secondaryResearch: string;
    marketEstimation: string;
    forecastingApproach: string;
    validation: string;
    assumptions: string;
  };
  metadata: {
    sourceFile: string;
    retrievedOn: string;
    language: string;
  };
  price: number;
  imageUrl?: string;
  pages: number;
  format: string;
  forecastData: {
    year: string;
    value: number;
  }[];
  revenueByRegionData: {
    region: string;
    value: number;
  }[];
  segmentShareData: {
    name: string;
    value: number;
    color?: string;
  }[];
  sentimentData: {
    label: string;
    value: number;
  }[];
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },

    publisher: { type: String },
    industry: { type: String },
    segment: { type: String },

    timeframe: {
      baseYear: Number,
      forecastStart: Number,
      forecastEnd: Number,
      studyPeriod: String,
    },

    marketOverview: {
      marketSizeBaseYear: String,
      marketSizeForecastYear: String,
      cagr: String,
      summary: String,
    },

    reportScope: String,

    segmentation: {
      byOffering: [String],
      byDeployment: [String],
      byEndUserIndustry: [String],
      byRegion: [String],
    },

    marketDynamics: {
      drivers: [String],
      restraints: [String],
      opportunities: [String],
      challenges: [String],
    },

    regionalAnalysis: [
      {
        region: String,
        description: String,
        sharePercent: String,
        cagr: String,
      },
    ],

    competitiveLandscape: {
      marketConcentration: String,
      topPlayers: [String],
      recentDevelopments: [
        {
          company: String,
          event: String,
          date: String,
        },
      ],
      strategicInitiatives: [String],
    },

    researchMethodology: {
      primaryResearch: String,
      secondaryResearch: String,
      marketEstimation: String,
      forecastingApproach: String,
      validation: String,
      assumptions: String,
    },

    metadata: {
      sourceFile: String,
      retrievedOn: String,
      language: String,
    },

    price: Number,
    imageUrl: String,
    pages: Number,
    format: String,

    forecastData: [
      {
        year: String,
        value: Number,
      },
    ],

    revenueByRegionData: [
      {
        region: String,
        value: Number,
      },
    ],

    segmentShareData: [
      {
        name: String,
        value: Number,
        color: String,
      },
    ],

    sentimentData: [
      {
        label: String,
        value: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
