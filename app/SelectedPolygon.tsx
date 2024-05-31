import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  polygon: any; // 폴리곤 데이터
}

const SelectedPolygon: React.FC<Props> = ({ polygon }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // SVG 요소의 너비와 높이 설정
    const width = window.innerWidth / 2; // 전체 화면의 가로폭의 반
    const height = window.innerHeight; // 전체 화면의 높이

    // 지리적 투영 생성
    const projection = d3.geoMercator()
      .fitSize([width, height], polygon);

    // 패스 생성기 생성
    const path = d3.geoPath()
      .projection(projection);

    // 기존 그림을 지우고 새로운 폴리곤을 그리기
    svg.selectAll('*').remove();
    svg.append('path')
      .attr('d', path(polygon))
      .attr('fill', '#088')
      .attr('stroke', '#000');

  }, [polygon]);

  return (
    <div style={{ width: '50vw', height: '100vh'  }}> {/* 전체 화면의 가로폭의 반 */}
      {/* 선택된 폴리곤을 그리는 SVG */}
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default SelectedPolygon;
