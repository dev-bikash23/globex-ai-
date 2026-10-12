package com.globex.currency.controller;

import com.globex.currency.service.CurrencyService;
import com.globex.integration.currency.dto.CurrencyRateResponse;
import com.globex.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/currency")
@Tag(name = "Currency", description = "Foreign exchange rates and conversion")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/rates")
    @Operation(summary = "Get exchange rate between two currencies")
    public ResponseEntity<ApiResponse<CurrencyRateResponse>> getExchangeRate(
            @RequestParam(defaultValue = "USD") String base,
            @RequestParam(defaultValue = "EUR") String target) {
        CurrencyRateResponse response = currencyService.getExchangeRate(base, target);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/currencies")
    @Operation(summary = "Get map of supported currencies and their names")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSupportedCurrencies() {
        Map<String, String> currencies = currencyService.getSupportedCurrencies();
        return ResponseEntity.ok(ApiResponse.success(currencies));
    }
}
