import { ActionPanel, List, showToast, Toast, LocalStorage, Detail} from '@raycast/api';
import { useEffect, useState } from 'react';

interface WaterRecord {
    date: string;
    waterIntake: number;
    waterGoal: number;
}

interface WaterData {
    [date: string]: WaterRecord;
}

export default function Command() {

    const LocalStorageKey = "waterData";

    const [waterGoal, setWaterGoal] = useState(2000); // 每日喝水目标（毫升）
    const [waterIntake, setWaterIntake] = useState<number | null>(null); // 当前已喝水量（毫升)

    const getCurrentDate = () => {
        const date = new Date();
        return date.toString().split("T")[0];
    }

    // get data from local storage.
    const getWaterData = async () => {
        let record : WaterRecord = { // default
            date : getCurrentDate(),
            waterIntake : 0,
            waterGoal : 2000,
        }
        let savedStr = await LocalStorage.getItem<string>(LocalStorageKey);
        if (savedStr !== undefined) {
            let savedData = JSON.parse(savedStr);
            record = savedData[getCurrentDate()];
        }
        return record;
    }

    
    const drinkWater = (amount: number) => {
        if (waterIntake !== null) {
            const newIntake = waterIntake + amount;
            setWaterIntake(newIntake);
            showToast(Toast.Style.Success, "咕噜咕噜!", `又喝了 ${amount} 毫升水`);
        } else {
            showToast(Toast.Style.Failure, "❌ 数据初始化错误!");
        }
    }

    const percisitData = async () => {
        let record : WaterRecord = {
            date : getCurrentDate(),
            waterIntake : waterIntake ?? 0,
            waterGoal : waterGoal
        }
        let savedStr = await LocalStorage.getItem<string>(LocalStorageKey);
        if (savedStr !== undefined) {
            let savedData = JSON.parse(savedStr);
            savedData[getCurrentDate()] = record;
            let newData : string = JSON.stringify(savedData);
            LocalStorage.setItem(LocalStorageKey, newData);
            console.log(`percieved data: ${newData}`);
        }
    }

    // 加载持久化的数据
    useEffect(() => {
        (async () => {
            try {
                const currentDate = getCurrentDate();
                let waterData: WaterRecord = {
                    date: "",
                    waterIntake : 0,
                    waterGoal : 0,
                };
                const savedData = await LocalStorage.getItem<string>(LocalStorageKey);
                if (savedData !== undefined) {
                    const waterData: WaterData = JSON.parse(savedData);
                    let savedWaterIntake = waterData[currentDate].waterIntake;
                    let waterGoal = waterData[currentDate].waterGoal;
                    if (savedWaterIntake !== undefined) {
                        console.log(`Loaded saved water intake: ${savedWaterIntake}`);
                        setWaterIntake(savedWaterIntake);
                        setWaterGoal(waterGoal);
                    } else {
                        setWaterIntake(0); // 初始值设置为 0
                    }
                }
            } catch (error) {
                console.error("Failed to load water intake:", error);
                setWaterIntake(0); // 加载失败时设置为 0
            }
        })();
    }, []);

    // 在喝水量变化时保存数据
    useEffect(() => {
        if (waterIntake === null) {
            return;
        }
        console.log(`set water intake ${waterIntake}`);
        percisitData(); // 持久化数据
    }, [waterIntake]);

    useEffect(() => {
        showToast({
            style: Toast.Style.Success,
            title: "喝水提醒",
            message: "🔔 请记得喝水！",
        });
    }, []);

    // 如果 waterIntake 仍然是 null，则显示加载状态
    if (waterIntake === null) {
        return <Detail markdown="加载中..." />;
    }

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
                    onAction={() => drinkWater(250)}
                />
                <ActionPanel.Item
                    title="添加 500 毫升"
                    onAction={() => drinkWater(500)}
                />
                </ActionPanel>
            }
            />
        </List>
    );
}
