// src/components/MaxMinProductionTable.tsx
import React, { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { fetchData } from '../data/fetchData';

interface AggregatedData {
  year: number;
  maxCrop: string;
  minCrop: string;
}

const MaxMinProductionTable: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);

  useEffect(() => {
    fetchData().then((crops) => {
      const aggregatedData: AggregatedData[] = [];
      const years = [...new Set(crops.map((crop) => crop.year))];

      years.forEach((year) => {
        const cropsInYear = crops.filter((crop) => crop.year === year);
        const maxCrop = cropsInYear.reduce((max, crop) => (crop.production > max.production ? crop : max), cropsInYear[0]);
        const minCrop = cropsInYear.reduce((min, crop) => (crop.production < min.production ? crop : min), cropsInYear[0]);

        aggregatedData.push({
          year,
          maxCrop: maxCrop.crop,
          minCrop: minCrop.crop,
        });
      });

      setData(aggregatedData);
    });
  }, []);

  return (
    <Table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Crop with Maximum Production</th>
          <th>Crop with Minimum Production</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.year}>
            <td>{row.year}</td>
            <td>{row.maxCrop}</td>
            <td>{row.minCrop}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MaxMinProductionTable;
