import { ActionPanel, List, showToast, Toast } from '@raycast/api';
import { useEffect, useState } from 'react';

export default function Command() {
  const [waterGoal, setWaterGoal] = useState(2000); // 每日喝水目标（毫升）
  const [waterIntake, setWaterIntake] = useState(0); // 当前喝水量（毫升）

  useEffect(() => {
    showToast({
      style: Toast.Style.Animated,
      title: "喝水提醒",
      message: "请记得喝水！",
    });
  }, []);

  return (
    <List>
      <List.Item
        title="今日喝水目标"
        subtitle={`${waterGoal} 毫升`}
      />
      <List.Item
        title="当前已喝水量"
        subtitle={`${waterIntake} 毫升`}
      />
      <List.Item
        title="添加喝水记录"
        actions={
          <ActionPanel>
            <ActionPanel.Item
              title="添加 250 毫升"
              onAction={() => setWaterIntake(waterIntake + 250)}
            />
            <ActionPanel.Item
              title="添加 500 毫升"
              onAction={() => setWaterIntake(waterIntake + 500)}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
