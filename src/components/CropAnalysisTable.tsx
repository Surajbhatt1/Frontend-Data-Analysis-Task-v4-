// src/components/CropAnalysisTable.tsx
import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { fetchData } from '../data/fetchData';

interface AnalysisData {
  crop: string;
  avgYield: number;
  avgArea: number;
}

const CropAnalysisTable: React.FC = () => {
  const [data, setData] = useState<AnalysisData[]>([]);

  useEffect(() => {
    fetchData().then((crops) => {
      const cropNames = [...new Set(crops.map((crop) => crop.crop))];

      const analysisData: AnalysisData[] = cropNames.map((cropName) => {
        const cropsOfSameName = crops.filter((crop) => crop.crop === cropName);
        const avgYield = cropsOfSameName.reduce((acc, crop) => acc + crop.yield, 0) / cropsOfSameName.length;
        const avgArea = cropsOfSameName.reduce((acc, crop) => acc + crop.area, 0) / cropsOfSameName.length;

        return {
          crop: cropName,
          avgYield: parseFloat(avgYield.toFixed(3)),
          avgArea: parseFloat(avgArea.toFixed(3)),
        };
      });

      setData(analysisData);
    });
  }, []);

  useEffect(() => {
    fetchData().then((crops) => {
      console.log('Fetched Crops Data:', crops);
      const cropNames = [...new Set(crops.map((crop) => crop.crop))];
  
      const analysisData: AnalysisData[] = cropNames.map((cropName) => {
        const cropsOfSameName = crops.filter((crop) => crop.crop === cropName);
        const avgYield = cropsOfSameName.reduce((acc, crop) => acc + crop.yield, 0) / cropsOfSameName.length;
        const avgArea = cropsOfSameName.reduce((acc, crop) => acc + crop.area, 0) / cropsOfSameName.length;
  
        return {
          crop: cropName,
          avgYield: parseFloat(avgYield.toFixed(3)),
          avgArea: parseFloat(avgArea.toFixed(3)),
        };
      });
  
      console.log('Analysis Data:', analysisData);
      setData(analysisData);
    });
  }, []);

  return (
    <Table>
      <thead>
        <tr>
          <th>Crop</th>
          <th>Average Yield (1950-2020)</th>
          <th>Average Cultivation Area (1950-2020)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.crop}>
            <td>{row.crop}</td>
            <td>{row.avgYield}</td>
            <td>{row.avgArea}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CropAnalysisTable;
