function getRiskColor(riskScore) {
    return riskScore > 95
      ? '#FF0000'  // 80-100% (High Risk - Red)
      : (riskScore > 90 && riskScore < 95)
      ? '#FF4500'  // 60-80% (Moderate-High Risk - OrangeRed)
      : (riskScore > 87 && riskScore < 90)
      ? '#FFA500'  // 40-60% (Moderate Risk - Orange)
      : (riskScore > 83 && riskScore < 87)
      ? '#FFFF00'  // 20-40% (Low Risk - Yellow)
      : '#00FF00'; // 0-20% (Minimal Risk - Green)
  }

export default getRiskColor;