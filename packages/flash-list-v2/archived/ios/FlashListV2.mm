#import "FlashListV2.h"

@implementation FlashListV2
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFlashListV2SpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"FlashListV2";
}

@end
