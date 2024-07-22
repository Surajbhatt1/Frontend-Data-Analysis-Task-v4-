
import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data.json';
import { Table, Container, Title, Loader } from '@mantine/core';

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number;
  "Area Under Cultivation (UOM:Ha(Hectares))": number;
}

interface YearlyProductionData {
  Year: string;
  maxCrop: string;
  minCrop: string;
}

interface AverageCropData {
  Crop: string;
  averageYield: number;
  averageArea: number;
}

const App: React.FC = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [yearlyProductionData, setYearlyProductionData] = useState<YearlyProductionData[]>([]);
  const [averageCropData, setAverageCropData] = useState<AverageCropData[]>([]);

  useEffect(() => {
    // Parse data and convert string fields to numbers
    const parsedData = data.map((entry) => ({
      ...entry,
      "Crop Production (UOM:t(Tonnes))": Number(entry["Crop Production (UOM:t(Tonnes))"]),
      "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": Number(entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]),
      "Area Under Cultivation (UOM:Ha(Hectares))": Number(entry["Area Under Cultivation (UOM:Ha(Hectares))"]),
    }));

    setCropData(parsedData);

    // Calculate the yearly production data
    const yearlyData: { [year: string]: { maxCrop: string, minCrop: string, maxProduction: number, minProduction: number } } = {};
    const cropTotals: { [crop: string]: { totalYield: number, totalArea: number, count: number } } = {};

    parsedData.forEach((entry) => {
      const year = entry.Year;
      const crop = entry["Crop Name"];
      const production = entry["Crop Production (UOM:t(Tonnes))"];
      const yieldOfCrops = entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
      const area = entry["Area Under Cultivation (UOM:Ha(Hectares))"];

      if (!yearlyData[year]) {
        yearlyData[year] = {
          maxCrop: crop,
          minCrop: crop,
          maxProduction: production,
          minProduction: production,
        };
      } else {
        if (production > yearlyData[year].maxProduction) {
          yearlyData[year].maxCrop = crop;
          yearlyData[year].maxProduction = production;
        }
        if (production < yearlyData[year].minProduction) {
          yearlyData[year].minCrop = crop;
          yearlyData[year].minProduction = production;
        }
      }

      if (!cropTotals[crop]) {
        cropTotals[crop] = { totalYield: yieldOfCrops, totalArea: area, count: 1 };
      } else {
        cropTotals[crop].totalYield += yieldOfCrops;
        cropTotals[crop].totalArea += area;
        cropTotals[crop].count += 1;
      }
    });

    const yearlyProductionArray = Object.entries(yearlyData).map(([year, data]) => ({
      Year: year,
      maxCrop: data.maxCrop,
      minCrop: data.minCrop,
    }));

    const averageCropArray = Object.entries(cropTotals).map(([crop, data]) => ({
      Crop: crop,
      averageYield: parseFloat((data.totalYield / data.count).toFixed(3)),
      averageArea: parseFloat((data.totalArea / data.count).toFixed(3)),
    }));

    setYearlyProductionData(yearlyProductionArray);
    setAverageCropData(averageCropArray);

  }, []);

  return (
    <div className="App">
      <Title order={1}>Crop Analytics Dashboard</Title>
      {cropData.length === 0 ? (
        <Loader color="teal" variant="dots" size="xl" />
      ) : (
        <>
          {/* <CropDataTable data={cropData} /> */}
          <YearlyProductionTable data={yearlyProductionData} />
          <AverageCropTable data={averageCropData} />
        </>
      )}
    </div>
  );
};

// interface CropDataTableProps {
//   data: CropData[];
// }


interface YearlyProductionTableProps {
  data: YearlyProductionData[];
}

const YearlyProductionTable: React.FC<YearlyProductionTableProps> = ({ data }) => (
  <Container className="table-container">
    <Title order={2}>Yearly Production Data</Title>
    <Table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Crop with Maximum Production</th>
          <th>Crop with Minimum Production</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>{entry.Year}</td>
            <td>{entry.maxCrop}</td>
            <td>{entry.minCrop}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
);

interface AverageCropTableProps {
  data: AverageCropData[];
}

const AverageCropTable: React.FC<AverageCropTableProps> = ({ data }) => (
  <Container className="table-container">
    <Title order={2}>Average Crop Data (1950-2020)</Title>
    <Table>
      <thead>
        <tr>
          <th>Crop</th>
          <th>Average Yield (Kg/Ha)</th>
          <th>Average Cultivation Area (Ha)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>{entry.Crop}</td>
            <td>{entry.averageYield}</td>
            <td>{entry.averageArea}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
);

export default App;

