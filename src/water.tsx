import { ActionPanel, List, showToast, Toast, LocalStorage } from '@raycast/api';
import { useEffect, useState } from 'react';

export default function Command() {
  const [waterGoal, setWaterGoal] = useState(2000); // 每日喝水目标（毫升）
  const [waterIntake, setWaterIntake] = useState(0); // 当前喝水量（毫升）

  // 加载持久化的数据
  useEffect(() => {
    (async () => {
      const savedWaterIntake = await LocalStorage.getItem<number>("waterIntake");
      if (savedWaterIntake !== undefined) {
        setWaterIntake(savedWaterIntake);
      }
    })();
  }, []);

  // 在喝水量变化时保存数据
  useEffect(() => {
    LocalStorage.setItem("waterIntake", waterIntake);
  }, [waterIntake]);

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
