import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Holdings Breakdown",
      font: {
        size: 14,
        weight: "600",
      },
      padding: {
        bottom: 15,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: false, // एकही नाव स्किप होणार नाही, सर्व ७ नावे दिसतील
        maxRotation: 0,  // नावे सरळ राहतील
        minRotation: 0,
        font: {
          size: 10,     // सर्व नावे मावण्यासाठी फॉन्ट हलकासा लहान
        },
        color: "#666",
      },
    },
    y: {
      grid: {
        color: "#f0f0f0",
      },
      ticks: {
        font: {
          size: 11,
        },
        color: "#888",
      },
    },
  },
};

export function VerticalGraph({ data }) {
  return <Bar options={options} data={data} />;
}