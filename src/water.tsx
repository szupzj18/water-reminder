import { ActionPanel, List, showToast, Toast, LocalStorage } from '@raycast/api';
import { useEffect, useState } from 'react';

export default function Command() {

  const [waterGoal, setWaterGoal] = useState(2000); // 每日喝水目标（毫升）
  const [waterIntake, setWaterIntake] = useState<number | null>(null); // 当前已喝水量（毫升)

  // 加载持久化的数据
  useEffect(() => {
    (async () => {
      try {
        const savedWaterIntake = await LocalStorage.getItem<number>("waterIntake");
        if (savedWaterIntake !== undefined) {
          console.log(`Loaded saved water intake: ${savedWaterIntake}`);
          setWaterIntake(savedWaterIntake);
        } else {
          setWaterIntake(0); // 初始值设置为 0
        }
      } catch (error) {
        console.error("Failed to load water intake:", error);
        setWaterIntake(0); // 加载失败时设置为 0
      }
    })();
  }, []);

  // 在喝水量变化时保存数据
  useEffect(() => {
    if (waterIntake == null) {
        return;
    }
    LocalStorage.setItem("waterIntake", waterIntake);
    console.log(`save water intake ${waterIntake}`);
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
