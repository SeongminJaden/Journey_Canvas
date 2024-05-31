'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import geoData from '../public/jeju.json'; // GeoJSON 파일을 가져옵니다.
import SelectedPolygon from './SelectedPolygon'; // 선택된 폴리곤을 그리는 컴포넌트를 불러옵니다.

const Map: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null); // 선택된 폴리곤을 저장할 상태
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // 업로드된 이미지를 저장할 상태

  const path = useRef<any>();

  const resizeImage = (image: HTMLImageElement): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        // Canvas를 지원하지 않는 경우
        resolve(canvas);
        return;
      }
  
      // 이미지의 크기를 반으로 줄입니다.
      const newWidth = image.width / 2;
      const newHeight = image.height / 2;
  
      canvas.width = newWidth;
      canvas.height = newHeight;
  
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
      // 리사이즈된 이미지를 반환합니다.
      resolve(canvas);
    });
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // SVG 요소의 너비와 높이 설정
    const width = 1920;
    const height = 1080;

    // 지리적 투영 생성
    const projection = d3.geoMercator()
      .fitSize([width, height], geoData);

    // path 함수 생성
    path.current = d3.geoPath()
      .projection(projection);

    // 패스 생성기 생성
    const pathGenerator = path.current;

    // 폴리곤 그리기
    svg.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .on('click', (event, d) => {
        // 클릭한 폴리곤의 데이터를 상태에 저장
        setSelectedPolygon(d);
      });

  }, []);

  // 이미지를 업로드했을 때 호출되는 함수
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result;
        setUploadedImage(imageUrl as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2 }}>
        {/* 지도 영역 */}
        <svg ref={svgRef} width={1920} height={1080}>
          {/* 업로드된 이미지를 배경으로 넣기 */}
          {uploadedImage && (
            <defs>
              <pattern id="imagePattern" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
                <image href={uploadedImage} x="0" y="0" width="100%" height="100%" />
              </pattern>
            </defs>
          )}
          {/* 선택된 폴리곤 */}
          {selectedPolygon && (
            <path
              d={path.current(selectedPolygon)}
              fill={uploadedImage ? "url(#imagePattern)" : "#fff"} // 이미지가 업로드되었을 때만 이미지 패턴을 적용
              stroke="#000"
            />
          )}
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        {/* 사이드바 영역 */}
        <div style={{ padding: '10px', borderLeft: '1px solid #ccc' }}>
          <h2>선택된 지역명</h2>
          <p>{selectedPolygon ? selectedPolygon.properties.adm_nm : '선택된 지역 없음'}</p>
          {/* 이미지 업로드 input */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>
    </div>
  );
};

export default Map;