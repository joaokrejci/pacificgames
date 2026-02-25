package org.example;

import java.util.HashMap;
import java.util.Map;

public class Config {
    private Config(){}
    private final Map<String, Object> config = new HashMap<>();

    public static Config instance = new Config();

    public <T> void put(String key, T param) {
        if (param == null) return;
        config.put(key, param);
    }

    public <T> T get(String key) {
        return (T) config.get(key);
    }
}
